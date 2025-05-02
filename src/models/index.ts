import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Sequelize,DataTypes } from 'sequelize';
import process from 'process';
import { config } from '../config/config';  // Import the config.ts file

const basename = path.basename(__filename);
console.log(basename)
const env = process.env.NODE_ENV || 'development';

// Accessing the configuration based on the environment

const db: { [key: string]: any } = {};  // You can replace `any` with model types later if needed

let sequelize: Sequelize;
  sequelize = new Sequelize(config.development.database as string, config.development.username as string, config.development.password, config.development as any);

  // console.log(__dirname);
// Reading model files and loading them into `db`
const load = async() =>{
  console.log("before file");
const files = fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf('.test.ts') === -1 // Change `.js` to `.ts` if you are using TypeScript files
    );
  })
  console.log("file",files);

  console.log("before for loop");
  for (const file of files) {
    const fullPath = path.join(__dirname, file);
    const modulePath = pathToFileURL(fullPath).href;
  
    // console.log('\n== Trying to load file ==');
    // console.log('Local path:', fullPath);
    // console.log('Module path (import URL):', modulePath);
  
    try {
      // let modelImport = await require(modulePath);
      const importedModule = require(fullPath);
      const model = importedModule(sequelize, DataTypes);
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

}

(async () => {
  await load();
})();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

// console.log(db.staff);