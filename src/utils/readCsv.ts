import fs from "fs";
import csv from "csv-parser";

export const readCsvFile = (filePath: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const result: string[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => result.push(data))
      .on("end", () => {
        console.log("CSV file readed successfully...");
        resolve(result);
      })
      .on("error", (err) => {
        console.error("Error Reading CSV ", err);
        reject(err);
      });
  });
};
