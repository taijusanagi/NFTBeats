import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface BlockAttributes {
  blockNumber: number;
  timestamp: Date;
  expectedTransactionCount: number;
}

export type BlockPk = "blockNumber";
export type BlockId = Block[BlockPk];
export type BlockCreationAttributes = BlockAttributes;

export class Block extends Model<BlockAttributes, BlockCreationAttributes> implements BlockAttributes {
  blockNumber!: number;
  timestamp!: Date;
  expectedTransactionCount!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof Block {
    return Block.init({
    blockNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expectedTransactionCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'blocks',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "blocks_pkey",
        unique: true,
        fields: [
          { name: "blockNumber" },
        ]
      },
    ]
  });
  }
}
