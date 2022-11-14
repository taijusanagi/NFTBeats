import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TransferAttributes {
  blockNumber: number;
  transactionIndex: number;
  logIndex: number;
  contract: string;
  from: string;
  to: string;
  tokenId: number;
}

export type TransferPk = "blockNumber" | "transactionIndex" | "logIndex";
export type TransferId = Transfer[TransferPk];
export type TransferCreationAttributes = TransferAttributes;

export class Transfer extends Model<TransferAttributes, TransferCreationAttributes> implements TransferAttributes {
  blockNumber!: number;
  transactionIndex!: number;
  logIndex!: number;
  contract!: string;
  from!: string;
  to!: string;
  tokenId!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof Transfer {
    return Transfer.init({
    blockNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    transactionIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    logIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    contract: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    from: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    to: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tokenId: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'transfers',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Transfer_pkey",
        unique: true,
        fields: [
          { name: "blockNumber" },
          { name: "transactionIndex" },
          { name: "logIndex" },
        ]
      },
    ]
  });
  }
}
