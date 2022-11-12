import { Sync } from "../lib/sync";
import { getTimeDiff, timeout } from "../lib/utils";
import networkJsonFile from "../network.json";

const chainId = "5";
const blockChunkSize = 5;
const blockTimeout = 2500;

const txHashChunkSize = 100;
const txHashTimeout = 10000;

async function main() {
  const sync = new Sync(networkJsonFile[chainId].rpc);
  const fromBlockNumber = 7930000;
  // const toBlockNumber = await sync.getBlockNumber();
  const toBlockNumber = 7930100;
  let blockChunks: number[] = [];
  let txHashChunks: string[] = [];
  let blockSyncFail = 0;
  let txHashSyncFail = 0;

  // get last-synced blockNumber

  const startAt = new Date();
  console.log("startAt          :", startAt);
  console.log("blockChunkSize   :", blockChunkSize);
  console.log("blockTimeout     :", blockTimeout);
  console.log("txHashChunkSize  :", txHashChunkSize);
  console.log("txHashTimeout    :", txHashTimeout);
  console.log("fromBlockNumber  :", fromBlockNumber);
  console.log("toBlockNumber    :", toBlockNumber);
  for (let blockNumber = fromBlockNumber; blockNumber <= toBlockNumber; blockNumber++) {
    blockChunks.push(blockNumber);
    if (blockChunks.length >= blockChunkSize || blockNumber >= toBlockNumber) {
      console.log("sync", blockChunks[0], blockChunks[blockChunks.length - 1]);
      const resolved = await timeout(sync.getTxHashesFromBlockNumbers(blockChunks), blockTimeout).catch(() => {
        console.log("sync fail at block sync");
        blockSyncFail++;
      });
      blockChunks = [];
      if (resolved) {
        const txHashes = resolved;
        console.log("txHashes", txHashes.length);
        let erc721TransferLogs: any = [];
        for (const [index, txHash] of txHashes.entries()) {
          txHashChunks.push(txHash);
          if (txHashChunks.length === txHashChunkSize || index === txHashes.length - 1) {
            const resolved = await timeout(sync.getERC721TransferLogsFromHashes(txHashChunks), txHashTimeout).catch(
              () => {
                console.log("sync fail at tx sync");
                txHashSyncFail++;
              }
            );
            txHashChunks = [];
            if (!resolved) {
              break;
            }
            erc721TransferLogs = erc721TransferLogs.concat(resolved);
          }
        }
        console.log(erc721TransferLogs);
      }
    }
  }
  const endAt = new Date();
  console.log("end at:          :", endAt);
  console.log("time:            :", getTimeDiff(startAt, endAt));
  console.log("blockSyncFail:   :", blockSyncFail);
  console.log("txHashSyncFail   :", txHashSyncFail);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
