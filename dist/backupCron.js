"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const child_process_1 = require("child_process");
const node_cron_1 = __importDefault(require("node-cron"));
dotenv_1.default.config();
// Minute (0-59)
// Hour (0-23)
// Day of month (1-31)
// Month (1-12)
// Day of week (0-7, where 0 or 7 is Sunday)
node_cron_1.default.schedule("0 23 29 * *", () => {
  const backupFile = `./backup/${process.env.DBNAME}_backup_${Date.now()}.sql`;
  const dumpCommand = `mysqldump -h ${process.env.DBHOST} -u ${process.env.DBUSER} -p ${process.env.DBPASSWORD} ${process.env.DBNAME} > ${backupFile}`;
  (0, child_process_1.exec)(dumpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error("Backup Failed ", error);
    }
    if (stderr) {
      console.error(`Backup stderr: ${stderr}`);
      return;
    }
    console.log(`Database backup successful! Backup file created at: ${backupFile}`);
  });
});
