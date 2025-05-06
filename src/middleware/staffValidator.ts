import { body, validationResult, param } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validateStaffUpdate = [
  body("staffName")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("StaffName is required")
    .isString()
    .withMessage("Staff name must be a string")
    .isLength({ min: 3, max: 12 })
    .withMessage("length should be minimun of 3 characters and maximum of 12 characters")
    .custom((value: string) => {
      if (/\d/.test(value)) {
        // Check if it contains a number
        throw new Error("Staff name cannot contain numbers");
      }
      return true;
    }),

  body("role")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("Role is required")
    .isString()
    .withMessage("role must be a string"),

  body("experience")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("Experience is required")
    .isInt({ min: 0, max: 50 })
    .withMessage("experience must be in range of 0-50"),

  body("password")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than 8 characters"),

  param("id")
    .trim()
    .notEmpty()
    .withMessage("id is required")
    .isInt()
    .withMessage("id must be a number"),

  handleValidationError,
];

const validateStaffCreate = [
  body("staffName")
    .trim()
    .notEmpty()
    .withMessage("Staff Name is required")
    .isString()
    .withMessage("Staff name must be a string")
    .isLength({ min: 3, max: 12 })
    .withMessage("length should be minimun of 3 characters and maximum of 12 characters")
    .custom((value: string) => {
      if (/\d/.test(value)) {
        // Check if it contains a number
        throw new Error("Staff name cannot contain numbers");
      }
      return true;
    }),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isString()
    .withMessage("Role must be a string")
    .custom((value: string) => {
      if (/\d/.test(value)) {
        // Check if it contains a number
        throw new Error("Staff name cannot contain numbers");
      }
      return true;
    }),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than 8 characters"),

  body("experience")
    .trim()
    .notEmpty()
    .withMessage("Experience required")
    .isInt({ min: 0, max: 50 })
    .withMessage("experience must be in range of 0-50"),

  body("email").trim().notEmpty().isEmail().withMessage("Invalid Email"),

  handleValidationError,
];

const validateStaffId = [
  param("id")
    .isInt()
    .withMessage("Staff Id must be an Integer")
    .notEmpty()
    .withMessage("Staff Id is required"),
  handleValidationError,
];

const validateStaffLogin = [
  body("staffName")
    .trim()
    .notEmpty()
    .withMessage("Staff Name is Required")
    .isString()
    .withMessage("Staff name must be a string")
    .custom((value: string) => {
      if (/\d/.test(value)) {
        // Check if it contains a number
        throw new Error("Staff name cannot contain numbers");
      }
      return true;
    }),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than 8 characters"),

  // body('role')
  //    .trim()
  //    .notEmpty().withMessage("Role is Required")
  //    .isString().withMessage("Role must be a string")
  //    .custom((value:string)=>{
  //       if(/\d/.test(value)){
  //          throw new Error("Role cannot contain Numbers");
  //       }
  //       return true;
  //    }),

  handleValidationError,
];

function handleValidationError(req: Request, res: Response, next: NextFunction): void {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({ error: error.array() });
    return;
  }
  next();
}

const validateStaffCSV = [
  body("data").isArray({ min: 1 }).withMessage("Data Must not be empty"),

  body("data.*.staffName")
    .trim()
    .notEmpty()
    .withMessage("Staff Name is Required")
    .isString()
    .withMessage("Staff name must be a string")
    .custom((value: string) => {
      if (/\d/.test(value)) {
        // Check if it contains a number
        throw new Error("Staff name cannot contain numbers");
      }
      return true;
    }),
  body("data.*.role")
    .trim()
    .notEmpty()
    .withMessage("Role is Required")
    .isString()
    .withMessage("Role must be a string")
    .custom((value: string) => {
      if (/\d/.test(value)) {
        throw new Error("Role cannot conatin Numbers");
      }
      return true;
    }),
  body("data.*.experience")
    .trim()
    .notEmpty()
    .withMessage("Experience required")
    .isInt({ min: 0, max: 50 })
    .withMessage("experience must be in range of 0-50"),

  body("data.*.password")
    .trim()
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than 8 characters"),

  handleValidationError,
];

// interface StaffCSV {
//    staffName: string;
//    role: string;
//    experience: number;
//    password: string;
//  }

// const validateStaffCSV = (req:Request,res:Response,next:NextFunction) => {
//    const staffData:StaffCSV[] = req.body.data;
//    const errors: { row: number; errors: string[]; }[] = [];

//    staffData.forEach((row,index)=>{
//       const rowError =[];

//       if(!row.staffName || row.staffName.trim() === ''){
//          rowError.push("Staff Name is Required");
//       }
//       if(!row.role || row.role.trim() === ''){
//          rowError.push("Role is Required");
//       }
//       if(!row.experience || row.experience < 50){
//          rowError.push("Experience should be in range of 0-50");
//       }
//       if(!row.password || row.password.length <= 7){
//          rowError.push("Password is required with min 8 characters");
//       }
//       if (rowError.length > 0) {
//          errors.push({ row: index + 1, errors: rowError });
//       }
//    });
//    if (errors.length > 0) {
//       return res.status(400).json({ message: "Validation failed", errors });
//    }
//    next();
// }

export {
  validateStaffCreate,
  validateStaffUpdate,
  validateStaffId,
  validateStaffLogin,
  validateStaffCSV,
};
