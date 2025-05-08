"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config_1 = __importDefault(require("../config/config"));
const student_1 = require("./student");
const staff_1 = require("./staff");
const email_1 = require("./email");
const html_1 = require("./html");
const basename = path_1.default.basename(__filename);
console.log(basename);
// const configg: { [key: string]: SequelizeOptions } = {};
const env = process.env.NODE_ENV || "development";
const configdata = config_1.default["development"];
// console.log(config);
if (!configdata) {
    console.error(`Database configuration for environment '${env}' not found!`);
    process.exit(1);
}
const sequelize = new sequelize_1.Sequelize(configdata.database, configdata.username, configdata.password, configdata);
const StudentModel = (0, student_1.initStudentModel)(sequelize);
const StaffModel = (0, staff_1.initStaffModel)(sequelize);
const EmailModel = (0, email_1.initEmailModel)(sequelize);
const HtmlModel = (0, html_1.inithtmlModel)(sequelize);
const db = {
    sequelize,
    Staff: StaffModel,
    Student: StudentModel,
    Email: EmailModel,
    Html: HtmlModel,
};
(_a = StudentModel.associate) === null || _a === void 0 ? void 0 : _a.call(StudentModel, db);
(_b = StaffModel.associate) === null || _b === void 0 ? void 0 : _b.call(StaffModel, db);
exports.default = db;
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import fs from "fs";
// import path from "path";
// import { Sequelize, DataTypes } from "sequelize";
// import { config } from "../config/config"; // Import the config.ts file
// const basename = path.basename(__filename);
// console.log(basename);
// // Accessing the configuration based on the environment
// const db: { [key: string]: any } = {}; // You can replace `any` with model types later if needed
// const sequelize: Sequelize = new Sequelize(
//   config.development.database as string,
//   config.development.username as string,
//   config.development.password,
//   config.development as any
// );
// // console.log(__dirname);
// // Reading model files and loading them into `db`
// const load = async () => {
//   console.log("before file");
//   const files = fs.readdirSync(__dirname).filter((file) => {
//     return (
//       file.indexOf(".") !== 0 &&
//       file !== basename &&
//       file.slice(-3) === ".js" &&
//       file.indexOf(".test.ts") === -1 // Change `.js` to `.ts` if you are using TypeScript files
//     );
//   });
//   console.log("file", files);
//   console.log("before for loop");
//   for (const file of files) {
//     const fullPath = path.join(__dirname, file);
//     // console.log('\n== Trying to load file ==');
//     // console.log('Local path:', fullPath);
//     // console.log('Module path (import URL):', modulePath);
//     try {
//       // let modelImport = await require(modulePath);
//       // eslint-disable-next-line @typescript-eslint/no-require-imports
//       const importedModule = require(fullPath);
//       const model = importedModule(sequelize, DataTypes);
//       // console.log('✅ Model loaded:', model.name);
//       db[model.name] = model;
//     } catch (err) {
//       // console.error('❌ Failed to import', file);
//       console.error(err);
//     }
//   }
//   // for(const file of files) {
//   //   // const model = require(path.join(__dirname, file)).default(sequelize,DataTypes);
//   //   // console.log(model);
//   //   // // Adjusted for TypeScript
//   //   // db[model.name] = model;
//   //   const modulePath = pathToFileURL(path.join(__dirname, file)).href;
//   //   // console.log(modulePath);
//   //   // console.log('Trying to import:', path.join(__dirname, file));
//   //   const { default: modelImport } = await import(modulePath);
//   //   const model = modelImport(sequelize, DataTypes);
//   //   console.log(model);
//   //   db[model.name] = model;
//   // };
//   // console.log("after for loop");
//   Object.keys(db).forEach((modelName) => {
//     if (db[modelName].associate) {
//       db[modelName].associate(db);
//     }
//   });
// };
// (async () => {
//   await load();
// })();
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// export default db;
// // console.log(db.staff);
