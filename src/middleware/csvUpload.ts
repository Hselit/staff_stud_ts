import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Storage configuration for CSV files
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, './uploads/');  // Same folder as images or different folder if required
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);  // You can customize the name
  },
});

// File filter for CSV files
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /csv/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'));
  }
};

// Create multer instance for CSV
const csvUpload = multer({ storage, fileFilter });

export default csvUpload;