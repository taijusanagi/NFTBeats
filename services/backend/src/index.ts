import axios, { AxiosError } from "axios";
import * as dotenv from "dotenv";
import express from "express";

import { env } from "./config/env";
import { getBlockNumberRange, syncBlocks } from "./implementation";
import { logger } from "./lib/utils/logger";
import { getTimeDiff } from "./lib/utils/time";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`ok`);
});

app.post("/sync", async (req, res) => {
  logger.info("sync");

  const startAt = new Date();

  const { latestSyncedBlockNumber, currentBlockNumber, fromBlockNumber, toBlockNumber } = await getBlockNumberRange();

  logger.info("sync-start: latestSyncedBlockNumber", latestSyncedBlockNumber);
  logger.info("sync-start: currentBlockNumber", currentBlockNumber);

  logger.info("sync-start: fromBlockNumber", fromBlockNumber);
  logger.info("sync-start: toBlockNumber", toBlockNumber);

  const expectedCount = toBlockNumber - fromBlockNumber + 1;
  let processedCount = 0;
  let okCount = 0;
  let errorCount = 0;
  const result = await new Promise((resolve) => {
    for (let blockNumber = toBlockNumber; blockNumber >= fromBlockNumber; blockNumber--) {
      axios
        .post(`${env.appUrl}/sync-blocks`, { blockNumbers: [blockNumber] })
        .then(({ data }) => {
          if (data.status === "ok") {
            okCount++;
          } else {
            errorCount++;
          }
        })
        .catch((e: AxiosError<{ error: string }>) => {
          logger.error("sync: call sync-blocks failed", blockNumber, e.message);
        })
        .finally(() => {
          processedCount++;
          if (processedCount === expectedCount) {
            const endAt = new Date();
            const timeDiff = getTimeDiff(startAt, endAt);

            logger.info("sync-end: fromBlockNumber", fromBlockNumber);
            logger.info("sync-end: toBlockNumber", toBlockNumber);
            logger.info("sync-end: okCount", okCount);
            logger.info("sync-end: errorCount", errorCount);
            logger.info("sync-end: timeDiff", timeDiff);

            resolve({
              latestSyncedBlockNumber,
              currentBlockNumber,
              fromBlockNumber,
              toBlockNumber,
              okCount,
              errorCount,
              timeDiff,
            });
          }
        });
    }
  });
  res.send(result);
});

app.post("/sync-blocks", async (req, res) => {
  const { blockNumbers } = req.body;
  const result = await syncBlocks(blockNumbers).catch((e) => {
    logger.error("sync-blocks: syncBlocks failed", blockNumbers, e.message);
    return { status: "error" };
  });
  res.send(result);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
