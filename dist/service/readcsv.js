"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCsvFile = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const readCsvFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const result = [];
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => result.push(data))
            .on('end', () => {
            console.log("CSV file readed successfully...");
            resolve(result);
        })
            .on('error', (err) => {
            console.error("Error Reading CSV ", err);
            reject(err);
        });
    });
};
exports.readCsvFile = readCsvFile;
