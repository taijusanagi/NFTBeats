import { Promise } from "bluebird";

import { Sync } from "../lib/sync";
import { getTimeDiff } from "../lib/utils";
import networkJsonFile from "../network.json";

const chainId = "5";

const blockNumberSyncChunkSize = 5;
const blockNumberSyncTimeout = 10000;

const txHashSyncConcurrency = 250;
const txHashSyncTimeout = 10000;

async function main() {
  const sync = new Sync(networkJsonFile[chainId].rpc);
  const fromBlockNumber = 7930000;
  // const toBlockNumber = await sync.getBlockNumber();
  const toBlockNumber = 7930100;
  let blockNumberChunks: number[] = [];
  let blockSyncFail = 0;
  let txHashSyncFail = 0;

  const startAt = new Date();
  console.log("startAt                      :  ", startAt);
  console.log("blockNumberSyncChunkSize     :  ", blockNumberSyncChunkSize);
  console.log("blockNumberSyncTimeout       :  ", blockNumberSyncTimeout);
  console.log("txHashSyncConcurrency        :  ", txHashSyncConcurrency);
  console.log("txHashSyncTimeout            :  ", txHashSyncTimeout);
  console.log("fromBlockNumber              :  ", fromBlockNumber);
  console.log("toBlockNumber                :  ", toBlockNumber);
  for (let blockNumber = fromBlockNumber; blockNumber <= toBlockNumber; blockNumber++) {
    blockNumberChunks.push(blockNumber);
    if (blockNumberChunks.length >= blockNumberSyncChunkSize || blockNumber >= toBlockNumber) {
      console.log("blockNumberRange:", blockNumberChunks[0], blockNumberChunks[blockNumberChunks.length - 1]);
      const getTxHashesFromBlockNumberResolved = await Promise.map(
        blockNumberChunks,
        (blockNumber) => sync.getTxHashesFromBlockNumber(blockNumber),
        { concurrency: blockNumberSyncChunkSize }
      )
        .timeout(blockNumberSyncTimeout)
        .catch(() => {
          console.log("sync fail at block sync");
          blockSyncFail++;
        });
      blockNumberChunks = [];
      if (getTxHashesFromBlockNumberResolved) {
        const txHashes: string[] = getTxHashesFromBlockNumberResolved.flat();
        console.log("txhashesLength:", txHashes.length);
        const erc721TransferLogsBeforeflat = await Promise.map(
          txHashes,
          (txHash) => sync.getERC721TransferLogsFromHash(txHash),
          { concurrency: txHashSyncConcurrency }
        )
          .timeout(txHashSyncTimeout)
          .catch(() => {
            console.log("sync fail at tx sync");
            txHashSyncFail++;
          });
        if (erc721TransferLogsBeforeflat) {
          const erc721TransferLogs = erc721TransferLogsBeforeflat.flat();
          console.log(erc721TransferLogs);
        }
      }
    }
  }
  const endAt = new Date();
  console.log("end at                       :  ", endAt);
  console.log("time                         :  ", getTimeDiff(startAt, endAt));
  console.log("blockSyncFail                :  ", blockSyncFail);
  console.log("txHashSyncFail               :  ", txHashSyncFail);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
