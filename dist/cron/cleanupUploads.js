"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Define the uploads folder path
const uploadsDir = path_1.default.join(__dirname, "../../uploads");
// Runs every Sunday at 2:00 AM
node_cron_1.default.schedule("0 2 * * 0", () => {
    console.log("Running weekly cleanup job for uploads folder...");
    fs_1.default.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error("Error reading uploads folder:", err);
            return;
        }
        files.forEach((file) => {
            const filePath = path_1.default.join(uploadsDir, file);
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
                else {
                    console.log(`Deleted file: ${file}`);
                }
            });
        });
    });
});
