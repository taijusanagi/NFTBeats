import type { Sequelize } from "sequelize";
import { Block as _Block } from "./block";
import type { BlockAttributes, BlockCreationAttributes } from "./block";
import { Transaction as _Transaction } from "./transaction";
import type { TransactionAttributes, TransactionCreationAttributes } from "./transaction";
import { Transfer as _Transfer } from "./transfer";
import type { TransferAttributes, TransferCreationAttributes } from "./transfer";

export { _Block as Block, _Transaction as Transaction, _Transfer as Transfer };

export type {
  BlockAttributes,
  BlockCreationAttributes,
  TransactionAttributes,
  TransactionCreationAttributes,
  TransferAttributes,
  TransferCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Block = _Block.initModel(sequelize);
  const Transaction = _Transaction.initModel(sequelize);
  const Transfer = _Transfer.initModel(sequelize);

  return {
    Block: Block,
    Transaction: Transaction,
    Transfer: Transfer,
  };
}
