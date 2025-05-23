import { StudentBase } from "../controller/dto/student.dto";
import { DB } from "./index";
import { Sequelize, Model, Optional, DataTypes } from "sequelize";

type studentCreationAttributes = Optional<StudentBase, "staff_id" | "id" | "profile">;

export class Student extends Model<StudentBase, studentCreationAttributes> implements StudentBase {
  declare studentName: string;
  declare marks: number;
  declare age: number;
  declare profile: string | null;
  declare id: number;
  declare password: string;
  declare staff_id: number;

  static associate(models: DB) {
    this.belongsTo(models.Staff, {
      foreignKey: "staff_id",
    });
  }
}

export function initStudentModel(sequelize: Sequelize): typeof Student {
  Student.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      studentName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        defaultValue: 18,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      staff_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "staff",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "student",
      tableName: "students",
      timestamps: false,
    }
  );

  return Student;
}
