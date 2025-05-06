"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
exports.initStudentModel = initStudentModel;
const sequelize_1 = require("sequelize");
class Student extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.Staff, {
            foreignKey: "staff_id",
        });
    }
}
exports.Student = Student;
function initStudentModel(sequelize) {
    Student.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        studentName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        marks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        age: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 18,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        profile: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        staff_id: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: "staff",
                key: "id",
            },
        },
    }, {
        sequelize,
        modelName: "student",
        tableName: "students",
        timestamps: false,
    });
    return Student;
}
