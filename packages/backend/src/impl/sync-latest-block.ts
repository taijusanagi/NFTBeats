import { Promise } from "bluebird";

import { parseERC721TransferLogs } from "../../../contracts/lib/parse";
import networkJsonFile from "../../../contracts/network.json";
import { ChainId } from "../../../contracts/types/ChainId";
import { models } from "../lib/sequelize";
import { TronProvider } from "../lib/tron/provider";
import { getTimeDiff } from "../lib/utils/time";

export const syncLatestBlock = async (
  chainId: ChainId,
  blockNumberSyncChunkSize: number,
  blockNumberSyncTimeout: number,
  txHashSyncConcurrency: number,
  txHashSyncTimeout: number
) => {
  const provider = new TronProvider(networkJsonFile[chainId].rpc);

  let blockNumberChunks: number[] = [];
  let blockSyncFail = 0;
  let txHashSyncFail = 0;
  let databaseFail = 0;

  const startAt = new Date();

  console.log("startAt                      :  ", startAt);

  console.log("blockNumberSyncChunkSize     :  ", blockNumberSyncChunkSize);
  console.log("blockNumberSyncTimeout       :  ", blockNumberSyncTimeout);
  console.log("txHashSyncConcurrency        :  ", txHashSyncConcurrency);
  console.log("txHashSyncTimeout            :  ", txHashSyncTimeout);

  const [latestSyncedBlock] = await models.SyncedBlock.findAll({
    limit: 1,
    order: [["blockNumber", "DESC"]],
  });
  const latestSyncedBlockNumber = latestSyncedBlock ? latestSyncedBlock.blockNumber : 0;
  const currentBlockNumber = await provider.getBlockNumber();

  const fromBlockNumber = currentBlockNumber;
  const toBlockNumber = latestSyncedBlockNumber;

  console.log("fromBlockNumber              :  ", fromBlockNumber);
  console.log("toBlockNumber                :  ", toBlockNumber);

  for (let blockNumber = currentBlockNumber; blockNumber > latestSyncedBlockNumber; blockNumber--) {
    blockNumberChunks.push(blockNumber);
    if (blockNumberChunks.length >= blockNumberSyncChunkSize || blockNumber >= latestSyncedBlockNumber + 1) {
      console.log("blockNumberRange:", blockNumberChunks[0], blockNumberChunks[blockNumberChunks.length - 1]);
      const getBlockResolved = await Promise.map(
        blockNumberChunks,
        (blockNumber) =>
          provider.getBlock(blockNumber).then(({ number, timestamp, transactions }) => {
            return {
              number,
              timestamp,
              transactions,
            };
          }),
        {
          concurrency: blockNumberSyncChunkSize,
        }
      )
        .timeout(blockNumberSyncTimeout)
        .catch((e) => {
          console.log("block sync fail:", e.message);
          blockSyncFail++;
        });
      blockNumberChunks = [];
      if (getBlockResolved) {
        const blockRecords = getBlockResolved.map(({ number, timestamp }) => {
          return { blockNumber: Number(number), timestamp: new Date(timestamp) };
        });
        const txHashes: string[] = getBlockResolved.map(({ transactions }) => transactions).flat();
        console.log("txhashesLength:", txHashes.length);
        const erc721TransferLogsBeforeflat = await Promise.map(
          txHashes,
          (txHash) => provider.getTransactionReceipt(txHash).then(({ logs }) => parseERC721TransferLogs(logs)),
          { concurrency: txHashSyncConcurrency }
        )
          .timeout(txHashSyncTimeout)
          .catch((e) => {
            console.log("tx sync fail: ", e.message);
            txHashSyncFail++;
          });

        if (erc721TransferLogsBeforeflat) {
          const transferRecords = erc721TransferLogsBeforeflat.flat();
          try {
            await models.SyncedBlock.bulkCreate(blockRecords, { ignoreDuplicates: true });
            await models.Transfer.bulkCreate(transferRecords, { ignoreDuplicates: true });
          } catch (e) {
            console.log("sync fail at saving transfer records");
            databaseFail++;
          }
        }
      }
    }
  }

  const endAt = new Date();

  console.log("end at                       :  ", endAt);
  console.log("time                         :  ", getTimeDiff(startAt, endAt));
  console.log("blockSyncFail                :  ", blockSyncFail);
  console.log("txHashSyncFail               :  ", txHashSyncFail);
  console.log("databaseFail                 :  ", databaseFail);
};
