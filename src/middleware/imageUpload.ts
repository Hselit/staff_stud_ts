import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
// import js from '../../'
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    console.log("Multer received file:", file);
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, png, jpg images are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
