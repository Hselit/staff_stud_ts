"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const sequelize_1 = require("sequelize");
const process_1 = __importDefault(require("process"));
const config_1 = require("../config/config"); // Import the config.ts file
const basename = path_1.default.basename(__filename);
console.log(basename);
const env = process_1.default.env.NODE_ENV || "development";
// Accessing the configuration based on the environment
const db = {}; // You can replace `any` with model types later if needed
let sequelize;
sequelize = new sequelize_1.Sequelize(
  config_1.config.development.database,
  config_1.config.development.username,
  config_1.config.development.password,
  config_1.config.development
);
// console.log(__dirname);
// Reading model files and loading them into `db`
const load = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log("before file");
    const files = fs_1.default.readdirSync(__dirname).filter((file) => {
      return (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js" &&
        file.indexOf(".test.ts") === -1 // Change `.js` to `.ts` if you are using TypeScript files
      );
    });
    console.log("file", files);
    console.log("before for loop");
    for (const file of files) {
      const fullPath = path_1.default.join(__dirname, file);
      const modulePath = (0, url_1.pathToFileURL)(fullPath).href;
      // console.log('\n== Trying to load file ==');
      // console.log('Local path:', fullPath);
      // console.log('Module path (import URL):', modulePath);
      try {
        // let modelImport = await require(modulePath);
        const importedModule = require(fullPath);
        const model = importedModule(sequelize, sequelize_1.DataTypes);
        // console.log('✅ Model loaded:', model.name);
        db[model.name] = model;
      } catch (err) {
        // console.error('❌ Failed to import', file);
        console.error(err);
      }
    }
    // for(const file of files) {
    //   // const model = require(path.join(__dirname, file)).default(sequelize,DataTypes);
    //   // console.log(model);
    //   // // Adjusted for TypeScript
    //   // db[model.name] = model;
    //   const modulePath = pathToFileURL(path.join(__dirname, file)).href;
    //   // console.log(modulePath);
    //   // console.log('Trying to import:', path.join(__dirname, file));
    //   const { default: modelImport } = await import(modulePath);
    //   const model = modelImport(sequelize, DataTypes);
    //   console.log(model);
    //   db[model.name] = model;
    // };
    // console.log("after for loop");
    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  });
(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield load();
  }))();
db.sequelize = sequelize;
db.Sequelize = sequelize_1.Sequelize;
exports.default = db;
// console.log(db.staff);
