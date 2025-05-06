"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
exports.initEmailModel = initEmailModel;
const sequelize_1 = require("sequelize");
class Email extends sequelize_1.Model {
}
exports.Email = Email;
function initEmailModel(sequelize) {
    Email.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        subject: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        html: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        cc: {
            type: sequelize_1.DataTypes.STRING,
        },
    }, {
        sequelize,
        timestamps: false,
        modelName: "email",
        tableName: "email",
    });
    return Email;
}
