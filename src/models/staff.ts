import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import { DB } from ".";
import { StaffBase } from "../controller/dto/staff.dto";

type StaffCreationAttributes = Optional<StaffBase, "id">;

export class Staff extends Model<StaffBase, StaffCreationAttributes> implements StaffBase {
  declare id?: number;
  declare staffName: string;
  declare role: string;
  declare experience: number;
  declare password: string;
  declare email: string;

  static associate(models: DB) {
    this.hasMany(models.Student, { foreignKey: "staff_id" });
  }
}

// Call this ONCE during app initialization, not on every import
export function initStaffModel(sequelize: Sequelize) {
  Staff.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      staffName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "staff",
      tableName: "staffs",
      timestamps: false,
    }
  );

  return Staff;
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use strict";

// import { Sequelize, Model } from "sequelize";

// export default (sequelize: Sequelize, DataTypes: any) => {
//   class staff extends Model {
//     static associate(models: { student: any }) {
//       staff.hasMany(models.student, {
//         foreignKey: "staff_id",
//       });
//     }
//   }

//   staff.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       staffName: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       role: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       experience: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//     },
//     {
//       sequelize,
//       modelName: "staff",
//       tableName: "staffs",
//       timestamps: false,
//     }
//   );
//   return staff;
// };
