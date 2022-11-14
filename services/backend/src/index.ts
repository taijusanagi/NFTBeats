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

  logger.info("sync-start: concurrency", env.concurrency);
  logger.info("sync-start: latestSyncedBlockNumber", latestSyncedBlockNumber);
  logger.info("sync-start: currentBlockNumber", currentBlockNumber);
  logger.info("sync-start: fromBlockNumber", fromBlockNumber);
  logger.info("sync-start: toBlockNumber", toBlockNumber);

  const expectedCount = toBlockNumber - fromBlockNumber + 1;
  let processedCount = 0;
  let okCount = 0;
  let errorCount = 0;
  const failedBlockNumbers: number[] = [];

  const result = await new Promise((resolve) => {
    for (let blockNumber = toBlockNumber; blockNumber >= fromBlockNumber; blockNumber--) {
      axios
        .post(`${env.appUrl}/sync-block?blockNumber=${blockNumber}`)
        .then(({ data }) => {
          if (data.status === "ok") {
            okCount++;
            logger.info("sync: sync-blocks completed", blockNumber);
          } else {
            errorCount++;
            failedBlockNumbers.push(blockNumber);
            logger.error("sync: sync-blocks failed", blockNumber, data.message);
          }
        })
        .catch((e: AxiosError<{ error: string }>) => {
          errorCount++;
          failedBlockNumbers.push(blockNumber);
          logger.error("sync: call sync-blocks failed", blockNumber, e.message);
        })
        .finally(() => {
          processedCount++;
          if (processedCount === expectedCount) {
            const endAt = new Date();
            const timeDiff = getTimeDiff(startAt, endAt);

            logger.info("sync-end: concurrency", env.concurrency);
            logger.info("sync-end: fromBlockNumber", fromBlockNumber);
            logger.info("sync-end: toBlockNumber", toBlockNumber);
            logger.info("sync-end: okCount", okCount);
            logger.info("sync-end: errorCount", errorCount);
            logger.info("failedBlockNumbers", failedBlockNumbers);
            logger.info("sync-end: timeDiff", timeDiff);

            resolve({
              latestSyncedBlockNumber,
              currentBlockNumber,
              fromBlockNumber,
              toBlockNumber,
              okCount,
              errorCount,
              failedBlockNumbers,
              timeDiff,
            });
          }
        });
      logger.info("sync: sync-blocks called", blockNumber);
    }
  });

  res.send(result);
});

app.post("/sync-block", async (req, res) => {
  const { blockNumber } = req.query;
  const result = await syncBlocks([Number(blockNumber)]).catch((e) => {
    return { status: "error", message: e.message };
  });
  res.send(result);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
