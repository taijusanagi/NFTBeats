import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface TransactionAttributes {
  blockNumber: number;
  transactionIndex: number;
  transactionHash: string;
  isSynced?: boolean;
}

export type TransactionPk = "blockNumber" | "transactionIndex";
export type TransactionId = Transaction[TransactionPk];
export type TransactionOptionalAttributes = "isSynced";
export type TransactionCreationAttributes = Optional<TransactionAttributes, TransactionOptionalAttributes>;

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  blockNumber!: number;
  transactionIndex!: number;
  transactionHash!: string;
  isSynced?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof Transaction {
    return Transaction.init(
      {
        blockNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        transactionIndex: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        transactionHash: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: "transactions_transactionHash_key",
        },
        isSynced: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "transactions",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "transactions_pkey",
            unique: true,
            fields: [{ name: "blockNumber" }, { name: "transactionIndex" }],
          },
          {
            name: "transactions_transactionHash_key",
            unique: true,
            fields: [{ name: "transactionHash" }],
          },
        ],
      }
    );
  }
}
