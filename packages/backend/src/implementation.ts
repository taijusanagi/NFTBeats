import { Promise } from "bluebird";
import { ethers } from "ethers";

import { env } from "./config/env";
import { getERC721TransfersFromLogs } from "./lib/contracts/parse";
import { models, sequelize } from "./lib/sequelize";
import { Block } from "./lib/sequelize/entity/block";
import { Transaction } from "./lib/sequelize/entity/transaction";
import { Transfer } from "./lib/sequelize/entity/transfer";
import { TronProvider } from "./lib/tron/provider";
import { logger } from "./lib/utils/logger";

const provider = new TronProvider(env.rpcUrl);

export const getBlockNumberRange = async () => {
  logger.debug("getBlockNumberRange");
  const [latestSyncedBlock] = await models.Block.findAll({
    limit: 1,
    order: [["blockNumber", "DESC"]],
  });
  const latestSyncedBlockNumber = latestSyncedBlock ? latestSyncedBlock.blockNumber : 0;
  const toBlockNumber = await provider.getBlockNumber();
  const fromBlockNumber = Math.max(toBlockNumber - env.syncRangeLimit, latestSyncedBlockNumber);
  return { fromBlockNumber, toBlockNumber };
};

export const syncBlocks = async (blockNumbers: number[]) => {
  logger.debug("syncBlocks", blockNumbers);
  const getBlockResolved = await Promise.map(
    blockNumbers,
    (blockNumber) =>
      provider.getBlock(blockNumber).then(({ number, timestamp, transactions }) => {
        return {
          number,
          timestamp,
          transactions,
        };
      }),
    {
      concurrency: env.concurrency,
    }
  ).catch((e) => {
    logger.error("fetch fail:", e.message);
    return [];
  });
  const blockRecords = getBlockResolved.map(({ number, timestamp }) => {
    return {
      blockNumber: Number(number),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      timestamp: Number(timestamp) as any,
    };
  });
  const transactionRecords = getBlockResolved
    .map(({ number, transactions }) => {
      return transactions.map((transactionHash, i) => {
        return {
          blockNumber: Number(number),
          transactionIndex: i,
          transactionHash,
        };
      });
    })
    .flat();
  const result = await sequelize
    .transaction(async (t) => {
      const blocks = await models.Block.bulkCreate(blockRecords, {
        ignoreDuplicates: true,
        transaction: t,
      });
      const transactions = await models.Transaction.bulkCreate(transactionRecords, {
        ignoreDuplicates: true,
        transaction: t,
      });
      return { blocks, transactions };
    })
    .catch((e) => {
      logger.error("save fail:", e.message);
      const blocks = [] as Block[];
      const transactions = [] as Transaction[];
      return { blocks, transactions };
    });
  return result;
};

export const syncTransactions = async (transactionHashes: string[]) => {
  logger.debug("syncTransactions", transactionHashes);
  const getTransactionReceiptResolved = await Promise.map(
    transactionHashes,
    (txHash) => provider.getTransactionReceipt(txHash),
    { concurrency: env.concurrency }
  ).catch((e) => {
    logger.error("fetch fail:", e.message);
    return [] as ethers.providers.TransactionReceipt[];
  });
  const transactionRecords = getTransactionReceiptResolved.map(({ blockNumber, transactionIndex, transactionHash }) => {
    return {
      blockNumber,
      transactionIndex,
      transactionHash,
      isSynced: true,
    };
  });
  const transferRecords = getTransactionReceiptResolved.map(({ logs }) => getERC721TransfersFromLogs(logs)).flat();
  const result = await sequelize
    .transaction(async (t) => {
      const transactions = await models.Transaction.bulkCreate(transactionRecords, {
        updateOnDuplicate: ["isSynced"],
        transaction: t,
      });
      const transfers = await models.Transfer.bulkCreate(transferRecords, {
        ignoreDuplicates: true,
        transaction: t,
      });
      return { transactions, transfers };
    })
    .catch((e) => {
      logger.error("save fail:", e.message);
      const transactions = [] as Transaction[];
      const transfers = [] as Transfer[];
      return { transactions, transfers };
    });
  return result;
};
