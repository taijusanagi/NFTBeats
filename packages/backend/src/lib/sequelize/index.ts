import { Sequelize } from "sequelize";

import { dbConnection } from "../../config/default";
import { initModels } from "./entity/init-models";

console.log("IS_GCP");
console.log(process.env.IS_GCP === "true");

export const sequelize =
  process.env.IS_GCP === "true"
    ? new Sequelize(process.env.DB_NAME || "", process.env.USERNAME || "", process.env.PASSWORD || "", {
        dialect: "postgres",
        host: `/cloudsql/${process.env.CONNECTION_NAME}`,
        dialectOptions: {
          socketPath: `/cloudsql/${process.env.CONNECTION_NAME}`,
        },
      })
    : new Sequelize(process.env.POSTGRES_CONNECTION || dbConnection);

export const models = initModels(sequelize);
