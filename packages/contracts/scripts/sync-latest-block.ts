import {
  blockNumberSyncChunkSize,
  blockNumberSyncTimeout,
  chainId,
  txHashSyncConcurrency,
  txHashSyncTimeout,
} from "../../backend/src/config/default";
import { syncLatestBlock } from "../../backend/src/impl/sync-latest-block";

async function main() {
  syncLatestBlock(chainId, blockNumberSyncChunkSize, blockNumberSyncTimeout, txHashSyncConcurrency, txHashSyncTimeout);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
