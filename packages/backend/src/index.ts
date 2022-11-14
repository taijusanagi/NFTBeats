import axios, { AxiosError, AxiosResponse } from "axios";
import * as dotenv from "dotenv";
import express from "express";

import { env } from "./config/env";
import { getBlockNumberRange, syncBlocks, syncTransactions } from "./implementation";
import { Block } from "./lib/sequelize/entity/block";
import { Transaction } from "./lib/sequelize/entity/transaction";
import { logger } from "./lib/utils/logger";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`ok`);
});

app.post("/cron", async (req, res) => {
  const { fromBlockNumber, toBlockNumber } = await getBlockNumberRange();
  axios.post(`${env.appUrl}/sync`, { fromBlockNumber, toBlockNumber });
  res.send({ status: "ok" });
});

app.post("/sync", async (req, res) => {
  const { fromBlockNumber, toBlockNumber } = req.body;

  console.log(fromBlockNumber, toBlockNumber);

  for (let blockNumber = toBlockNumber; blockNumber >= fromBlockNumber; blockNumber--) {
    axios
      .post(`${env.appUrl}/sync-blocks`, { blockNumbers: [blockNumber] })
      .then((res: AxiosResponse<{ blocks: Block[]; transactions: Transaction[] }>) => {
        const { transactions } = res.data;
        const transactionHashes = transactions.map(({ transactionHash }) => transactionHash);
        axios
          .post(`${env.appUrl}/sync-transactions`, { transactionHashes })
          .catch((e: AxiosError<{ error: string }>) => {
            logger.error("sync-transactions failed", e.message);
          });
      })
      .catch((e: AxiosError<{ error: string }>) => {
        logger.error("sync-blocks failed", e.message);
      });
  }
  res.send({ status: "ok" });
});

app.post("/sync-blocks", async (req, res) => {
  const { blockNumbers } = req.body;
  const result = await syncBlocks(blockNumbers);
  res.send(result);
});

app.post("/sync-transactions", async (req, res) => {
  const { transactionHashes } = req.body;
  const result = await syncTransactions(transactionHashes);
  res.send(result);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
