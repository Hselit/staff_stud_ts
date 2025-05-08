"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.html = void 0;
exports.inithtmlModel = inithtmlModel;
const sequelize_1 = require("sequelize");
class html extends sequelize_1.Model {
}
exports.html = html;
function inithtmlModel(sequelize) {
    html.init({
        id: {
            type: sequelize_1.DataTypes.NUMBER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        type: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        timestamps: false,
        modelName: "html",
        tableName: "html",
    });
    return html;
}
