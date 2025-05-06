"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Storage configuration for CSV files
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/"); // Same folder as images or different folder if required
    },
    filename: function (req, file, cb) {
        const name = `${Date.now()}-${file.originalname}`;
        cb(null, name); // You can customize the name
    },
});
// File filter for CSV files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /csv/;
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only CSV files are allowed"));
    }
};
// Create multer instance for CSV
const csvUpload = (0, multer_1.default)({ storage, fileFilter });
exports.default = csvUpload;
