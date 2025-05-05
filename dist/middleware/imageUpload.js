"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// import js from '../../'
const storage = multer_1.default.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    console.log("Multer received file:", file);
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path_1.default.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, png, jpg images are allowed"));
  }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
exports.default = upload;
