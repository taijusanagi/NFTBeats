import { Promise } from "bluebird";

import { models } from "../../backend/src/sequelize";
import { TronProvider } from "../lib/tron/provider";
import { parseERC721TransferLogs } from "../lib/utils/parse";
import { getTimeDiff } from "../lib/utils/time";
import networkJsonFile from "../network.json";

const blockNumberSyncChunkSize = 1;
const blockNumberSyncTimeout = 10000;

const txHashSyncConcurrency = 10;
const txHashSyncTimeout = 100000;

async function main() {
  // Georli
  // const chainId = "5";
  // const provider = new ethers.providers.JsonRpcProvider(networkJsonFile[chainId].rpc);

  // Tron
  const chainId = "728126428";
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
  const fromBlockNumber = latestSyncedBlock ? latestSyncedBlock.blockNumber : 0;
  const toBlockNumber = await provider.getBlockNumber();

  console.log("fromBlockNumber              :  ", fromBlockNumber);
  console.log("toBlockNumber                :  ", toBlockNumber);

  for (let blockNumber = fromBlockNumber; blockNumber <= toBlockNumber; blockNumber++) {
    blockNumberChunks.push(blockNumber);
    if (blockNumberChunks.length >= blockNumberSyncChunkSize || blockNumber >= toBlockNumber) {
      console.log("blockNumberRange:", blockNumberChunks[0], blockNumberChunks[blockNumberChunks.length - 1]);
      const getBlockResolved = await Promise.map(
        blockNumberChunks,
        (blockNumber) => provider.getBlock(blockNumber).then(({ transactions }) => transactions),
        {
          concurrency: blockNumberSyncChunkSize,
        }
      )
        .timeout(blockNumberSyncTimeout)
        .catch((e) => {
          console.log("block sync fail:", e.message);
          blockSyncFail++;
        });
      const blockRecords = blockNumberChunks.map((blockNumber) => {
        return { blockNumber };
      });
      blockNumberChunks = [];
      if (getBlockResolved) {
        const txHashes: string[] = getBlockResolved.flat();
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
