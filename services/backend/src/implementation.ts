import { Promise } from "bluebird";

import { env } from "./config/env";
import { getERC721TransfersFromLogs } from "./lib/contracts/parse";
import { models, sequelize } from "./lib/sequelize";
import { TronProvider } from "./lib/tron/provider";
import { logger } from "./lib/utils/logger";

export const getBlockNumberRange = async () => {
  const provider = new TronProvider(env.rpcUrl);
  const [latestSyncedBlock] = await models.Block.findAll({
    limit: 1,
    order: [["blockNumber", "DESC"]],
  });
  const latestSyncedBlockNumber = latestSyncedBlock ? latestSyncedBlock.blockNumber : 0;
  const currentBlockNumber = await provider.getBlockNumber();

  const toBlockNumber = currentBlockNumber;
  const fromBlockNumber = Math.max(toBlockNumber - env.syncRangeLimit, latestSyncedBlockNumber);
  return { latestSyncedBlockNumber, currentBlockNumber, fromBlockNumber, toBlockNumber };
};

export const syncBlocks = async (blockNumbers: number[]) => {
  logger.debug("syncBlocks: start", ...blockNumbers);
  const provider = new TronProvider(env.rpcUrl);
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
  );
  const transactionHashes = getBlockResolved.map(({ transactions }) => transactions).flat();

  logger.debug("syncBlocks: start", ...blockNumbers, "transactionHashesLength", transactionHashes.length);

  const getTransactionReceiptResolved = await Promise.map(
    transactionHashes,
    (txHash) => provider.getTransactionReceipt(txHash),
    { concurrency: env.concurrency }
  );
  const blockRecords = getBlockResolved.map(({ number, timestamp }) => {
    return {
      blockNumber: Number(number),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      timestamp: Number(timestamp) as any,
    };
  });
  const transferRecords = getTransactionReceiptResolved.map(({ logs }) => getERC721TransfersFromLogs(logs)).flat();
  const result = await sequelize.transaction(async (t) => {
    await models.Block.bulkCreate(blockRecords, {
      ignoreDuplicates: true,
      transaction: t,
    });
    await models.Transfer.bulkCreate(transferRecords, {
      ignoreDuplicates: true,
      transaction: t,
    });
    return { status: "ok" };
  });

  logger.debug("syncBlocks: end", ...blockNumbers, "transactionHashesLength", transactionHashes.length);
  return result;
};
