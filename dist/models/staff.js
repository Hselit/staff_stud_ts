"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
exports.initStaffModel = initStaffModel;
const sequelize_1 = require("sequelize");
class Staff extends sequelize_1.Model {
    static associate(models) {
        this.hasMany(models.Student, { foreignKey: "staff_id" });
    }
}
exports.Staff = Staff;
// Call this ONCE during app initialization, not on every import
function initStaffModel(sequelize) {
    Staff.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        staffName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        experience: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "staff",
        tableName: "staffs",
        timestamps: false,
    });
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
