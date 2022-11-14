const getEnv = () => {
  const isGcp = process.env.IS_GCP === "true";
  if (isGcp) {
    if (!process.env.DB_NAME || !process.env.USERNAME || !process.env.PASSWORD || !process.env.CONNECTION_NAME) {
      throw new Error("database config not set for gcp");
    }
  }
  return {
    isDebugLogEnabled: process.env.IS_DEBUG_LOG_ENABLED === "true",
    appUrl: process.env.APP_URL ? process.env.APP_URL : "http://localhost:8080",
    rpcUrl: process.env.RPC_URL ? process.env.RPC_URL : "https://api.trongrid.io/jsonrpc",
    dbConnectionUrl: process.env.DB_CONNECTION_URL
      ? process.env.DB_CONNECTION_URL
      : "postgres://postgres:postgrespassword@postgres:5432/postgres",

    concurrency: process.env.CUNCURRENCY ? Number(process.env.CUNCURRENCY) : 5,
    syncRangeLimit: process.env.SYNC_RANGE_LIMIT ? Number(process.env.SYNC_RANGE_LIMIT) : 30,
    isGcp,
    // the following values are validated already
    dbName: process.env.DB_NAME || "",
    userName: process.env.USERNAME || "",
    password: process.env.PASSWORD || "",
    connectionName: process.env.CONNECTION_NAME || "",
  };
};

export const env = getEnv();
