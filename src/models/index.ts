import fs from 'fs';
import path from 'path';
import { Sequelize,DataTypes } from 'sequelize';
import process from 'process';
import { config } from '../config/config';  // Import the config.ts file

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Accessing the configuration based on the environment

const db: { [key: string]: any } = {};  // You can replace `any` with model types later if needed

let sequelize: Sequelize;
  sequelize = new Sequelize(config.development.database as string, config.development.username as string, config.development.password, config.development as any);

// Reading model files and loading them into `db`
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts' &&  // Change `.js` to `.ts` if you are using TypeScript files
      file.indexOf('.test.ts') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default(sequelize,DataTypes); // Adjusted for TypeScript
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
