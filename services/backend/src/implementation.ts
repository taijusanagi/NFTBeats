import { Promise } from "bluebird";
import { ethers } from "ethers";

import { env } from "./config/env";
import { getERC721TransfersFromLogs } from "./lib/contracts/parse";
import { models, sequelize } from "./lib/sequelize";
import { TronProvider } from "./lib/tron/provider";
import { logger } from "./lib/utils/logger";
import { SyncBlocksOutput, SyncTransactionsOutput } from "./types/data";

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

export const syncBlocks = async (blockNumbers: number[]): Promise<SyncBlocksOutput> => {
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
    logger.error("syncBlocks: fetch fail:", e.message);
    return [];
  });
  const blockRecords = getBlockResolved.map(({ number, timestamp, transactions }) => {
    return {
      blockNumber: Number(number),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      timestamp: Number(timestamp) as any,
      expectedTransactionCount: transactions.length,
    };
  });
  const transactionHashes = getBlockResolved.map(({ transactions }) => transactions).flat();
  const result = await sequelize
    .transaction(async (t) => {
      await models.Block.bulkCreate(blockRecords, {
        ignoreDuplicates: true,
        transaction: t,
      });
      return { transactionHashes };
    })
    .catch((e) => {
      logger.error("syncBlocks: save fail:", e.message);
      return { transactionHashes: [] as string[] };
    });
  return result;
};

export const syncTransactions = async (transactionHashes: string[]): Promise<SyncTransactionsOutput> => {
  logger.debug("syncTransactions", transactionHashes);
  const getTransactionReceiptResolved = await Promise.map(
    transactionHashes,
    (txHash) => provider.getTransactionReceipt(txHash),
    { concurrency: env.concurrency }
  ).catch((e) => {
    logger.error("syncTransactions: fetch fail:", e.message);
    return [] as ethers.providers.TransactionReceipt[];
  });
  const transactionRecords = getTransactionReceiptResolved.map(({ blockNumber, transactionIndex, transactionHash }) => {
    return {
      blockNumber,
      transactionIndex,
      transactionHash,
    };
  });
  const transferRecords = getTransactionReceiptResolved.map(({ logs }) => getERC721TransfersFromLogs(logs)).flat();
  await sequelize
    .transaction(async (t) => {
      await models.Transaction.bulkCreate(transactionRecords, {
        ignoreDuplicates: true,
        transaction: t,
      });
      await models.Transfer.bulkCreate(transferRecords, {
        ignoreDuplicates: true,
        transaction: t,
      });
    })
    .catch((e) => {
      logger.error("syncTransactions: save fail:", e.message);
    });
  
};
