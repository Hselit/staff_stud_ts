import dotenv from "dotenv";
import { exec } from "child_process";
import cron from "node-cron";

dotenv.config();

// Minute (0-59)
// Hour (0-23)
// Day of month (1-31)
// Month (1-12)
// Day of week (0-7, where 0 or 7 is Sunday)

cron.schedule("0 23 29 * *", () => {
  const backupFile = `./backup/${process.env.DBNAME}_backup_${Date.now()}.sql`;
  const dumpCommand = `mysqldump -h ${process.env.DBHOST} -u ${process.env.DBUSER} -p ${process.env.DBPASSWORD} ${process.env.DBNAME} > ${backupFile}`;

  exec(dumpCommand, (error, stdout, stderr) => {
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

// const express =  require('express');
// const cron = require('node-cron');

// const app = express();
// cron.schedule('*/10 * * * * *',()=>{
//    console.log("I am time bomb....");
// });

// app.listen(3000);
