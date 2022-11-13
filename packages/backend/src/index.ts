import express from "express";

import {
  blockNumberSyncChunkSize,
  blockNumberSyncTimeout,
  chainId,
  port as _port,
  txHashSyncConcurrency,
  txHashSyncTimeout,
} from "./config/default";
import { syncLatestBlock } from "./impl/sync-latest-block";

const app = express();
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send(`ok`);
});

app.post("/sync-latest-block", async (req, res) => {
  await syncLatestBlock(
    req.body.chainId || chainId,
    req.body.blockNumberSyncChunkSize || blockNumberSyncChunkSize,
    req.body.blockNumberSyncTimeout || blockNumberSyncTimeout,
    req.body.txHashSyncConcurrency || txHashSyncConcurrency,
    req.body.txHashSyncTimeout || txHashSyncTimeout
  );
  res.send(`ok`);
});

const port = process.env.PORT || _port;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
