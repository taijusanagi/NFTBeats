import * as Sequelize from "sequelize";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DataTypes, Model, Optional } from "sequelize";

export interface SyncedBlockAttributes {
  blockNumber: number;
  timestamp: Date;
}

export type SyncedBlockPk = "blockNumber";
// eslint-disable-next-line no-use-before-define
export type SyncedBlockId = SyncedBlock[SyncedBlockPk];
export type SyncedBlockCreationAttributes = SyncedBlockAttributes;

export class SyncedBlock
  extends Model<SyncedBlockAttributes, SyncedBlockCreationAttributes>
  implements SyncedBlockAttributes
{
  blockNumber!: number;
  timestamp!: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof SyncedBlock {
    return SyncedBlock.init(
      {
        blockNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "syncedBlocks",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "blocks_pkey",
            unique: true,
            fields: [{ name: "blockNumber" }],
          },
        ],
      }
    );
  }
}
