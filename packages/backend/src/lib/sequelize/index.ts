import { Sequelize } from "sequelize";

import { env } from "../../config/env";
import { initModels } from "./entity/init-models";

export const sequelize = env.isGcp
  ? new Sequelize(env.dbName, env.userName, env.password, {
      dialect: "postgres",
      host: `/cloudsql/${env.connectionName}`,
      dialectOptions: {
        socketPath: `/cloudsql/${env.connectionName}`,
      },
      logging: env.isDebugLogEnabled,
    })
  : new Sequelize(env.dbConnectionUrl, { logging: env.isDebugLogEnabled });

export const models = initModels(sequelize);
