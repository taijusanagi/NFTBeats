import type { Sequelize } from "sequelize";

import type { SyncedBlockAttributes, SyncedBlockCreationAttributes } from "./synced-block";
import { SyncedBlock as _SyncedBlock } from "./synced-block";
import type { TransferAttributes, TransferCreationAttributes } from "./transfer";
import { Transfer as _Transfer } from "./transfer";

export { _SyncedBlock as SyncedBlock, _Transfer as Transfer };

export type { SyncedBlockAttributes, SyncedBlockCreationAttributes, TransferAttributes, TransferCreationAttributes };

export function initModels(sequelize: Sequelize) {
  const SyncedBlock = _SyncedBlock.initModel(sequelize);
  const Transfer = _Transfer.initModel(sequelize);

  return {
    SyncedBlock,
    Transfer,
  };
}
