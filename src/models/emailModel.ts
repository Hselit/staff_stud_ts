"use strict";
import { Model, Sequelize, Optional, DataTypes } from "sequelize";
import { EmailData } from "../dto/email.dto";

type emailCreation = Optional<EmailData, "id" | "cc">;

export class Email extends Model<EmailData, emailCreation> implements EmailData {
  id!: number;
  type!: string;
  subject!: string;
  html!: string;
  cc!: string;
}

export function initEmailModel(sequelize: Sequelize): typeof Email {
  Email.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      html: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      cc: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "email",
      tableName: "email",
    }
  );
  return Email;
}
