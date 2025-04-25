"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const process_1 = __importDefault(require("process"));
const config_1 = require("../config/config"); // Import the config.ts file
const basename = path_1.default.basename(__filename);
const env = process_1.default.env.NODE_ENV || 'development';
// Accessing the configuration based on the environment
const db = {}; // You can replace `any` with model types later if needed
let sequelize;
sequelize = new sequelize_1.Sequelize(config_1.config.development.database, config_1.config.development.username, config_1.config.development.password, config_1.config.development);
// Reading model files and loading them into `db`
fs_1.default.readdirSync(__dirname)
    .filter((file) => {
    return (file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.ts' && // Change `.js` to `.ts` if you are using TypeScript files
        file.indexOf('.test.ts') === -1);
})
    .forEach((file) => {
    const model = require(path_1.default.join(__dirname, file)).default(sequelize, sequelize_1.DataTypes); // Adjusted for TypeScript
    db[model.name] = model;
});
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = sequelize_1.Sequelize;
exports.default = db;
