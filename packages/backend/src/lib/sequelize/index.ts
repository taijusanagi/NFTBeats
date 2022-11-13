import { Sequelize } from "sequelize";

import { initModels } from "../../../../graphql-engine/dist/entity/init-models";

export const sequelize = new Sequelize(process.env.POSTGRES_CONNECTION || "");

export const models = initModels(sequelize);
