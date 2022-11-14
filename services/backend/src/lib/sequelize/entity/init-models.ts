import type { Sequelize } from "sequelize";
import { Block as _Block } from "./block";
import type { BlockAttributes, BlockCreationAttributes } from "./block";
import { Transfer as _Transfer } from "./transfer";
import type { TransferAttributes, TransferCreationAttributes } from "./transfer";

export { _Block as Block, _Transfer as Transfer };

export type { BlockAttributes, BlockCreationAttributes, TransferAttributes, TransferCreationAttributes };

export function initModels(sequelize: Sequelize) {
  const Block = _Block.initModel(sequelize);
  const Transfer = _Transfer.initModel(sequelize);

  return {
    Block: Block,
    Transfer: Transfer,
  };
}
