import { DataTypes, Sequelize, Model } from "sequelize";

interface htmlStructure {
  id: string;
  type: string;
  content: string;
}
export class html extends Model<htmlStructure> implements htmlStructure {
  id!: string;
  type!: string;
  content!: string;
}

export function inithtmlModel(sequelize: Sequelize): typeof html {
  html.init(
    {
      id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "html",
      tableName: "html",
    }
  );
  return html;
}
