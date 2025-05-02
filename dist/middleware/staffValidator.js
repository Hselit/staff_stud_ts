"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStaffCSV = exports.validateStaffLogin = exports.validateStaffId = exports.validateStaffUpdate = exports.validateStaffCreate = void 0;
const express_validator_1 = require("express-validator");
const validateStaffUpdate = [
    (0, express_validator_1.body)('staffName')
        .trim()
        .optional()
        .notEmpty().withMessage("StaffName is required")
        .isString().withMessage("Staff name must be a string")
        .isLength({ min: 3, max: 12 }).withMessage("length should be minimun of 3 characters and maximum of 12 characters")
        .custom((value) => {
        if (/\d/.test(value)) { // Check if it contains a number
            throw new Error("Staff name cannot contain numbers");
        }
        return true;
    }),
    (0, express_validator_1.body)('role')
        .trim()
        .optional()
        .notEmpty().withMessage("Role is required")
        .isString().withMessage("role must be a string"),
    (0, express_validator_1.body)('experience')
        .trim()
        .optional()
        .notEmpty().withMessage("Experience is required")
        .isInt({ min: 0, max: 50 }).withMessage("experience must be in range of 0-50"),
    (0, express_validator_1.body)('password')
        .trim()
        .optional()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password length must be greater than 8 characters"),
    (0, express_validator_1.param)('id')
        .trim()
        .notEmpty().withMessage("id is required")
        .isInt().withMessage("id must be a number"),
    handleValidationError,
];
exports.validateStaffUpdate = validateStaffUpdate;
const validateStaffCreate = [
    (0, express_validator_1.body)('staffName')
        .trim()
        .notEmpty().withMessage("Staff Name is required")
        .isString().withMessage("Staff name must be a string")
        .isLength({ min: 3, max: 12 }).withMessage("length should be minimun of 3 characters and maximum of 12 characters")
        .custom((value) => {
        if (/\d/.test(value)) { // Check if it contains a number
            throw new Error("Staff name cannot contain numbers");
        }
        return true;
    }),
    (0, express_validator_1.body)('role')
        .trim()
        .notEmpty().withMessage("Role is required")
        .isString().withMessage("Role must be a string")
        .custom((value) => {
        if (/\d/.test(value)) { // Check if it contains a number
            throw new Error("Staff name cannot contain numbers");
        }
        return true;
    }),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password length must be greater than 8 characters"),
    (0, express_validator_1.body)('experience')
        .trim()
        .notEmpty().withMessage("Experience required")
        .isInt({ min: 0, max: 50 }).withMessage("experience must be in range of 0-50"),
    handleValidationError,
];
exports.validateStaffCreate = validateStaffCreate;
const validateStaffId = [
    (0, express_validator_1.param)("id")
        .isInt().withMessage("Staff Id must be an Integer")
        .notEmpty().withMessage("Staff Id is required"),
    handleValidationError,
];
exports.validateStaffId = validateStaffId;
const validateStaffLogin = [
    (0, express_validator_1.body)('staffName')
        .trim()
        .notEmpty().withMessage("Staff Name is Required")
        .isString().withMessage("Staff name must be a string")
        .custom((value) => {
        if (/\d/.test(value)) { // Check if it contains a number
            throw new Error("Staff name cannot contain numbers");
        }
        return true;
    }),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password length must be greater than 8 characters"),
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
exports.validateStaffLogin = validateStaffLogin;
function handleValidationError(req, res, next) {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
        return;
    }
    next();
}
const validateStaffCSV = [
    (0, express_validator_1.body)('data')
        .isArray({ min: 1 }).withMessage("Data Must not be empty"),
    (0, express_validator_1.body)('data.*.staffName')
        .trim()
        .notEmpty().withMessage("Staff Name is Required")
        .isString().withMessage("Staff name must be a string")
        .custom((value) => {
        if (/\d/.test(value)) { // Check if it contains a number
            throw new Error("Staff name cannot contain numbers");
        }
        return true;
    }),
    (0, express_validator_1.body)('data.*.role')
        .trim()
        .notEmpty().withMessage("Role is Required")
        .isString().withMessage("Role must be a string")
        .custom((value) => {
        if (/\d/.test(value)) {
            throw new Error("Role cannot conatin Numbers");
        }
        return true;
    }),
    (0, express_validator_1.body)('data.*.experience')
        .trim()
        .notEmpty().withMessage("Experience required")
        .isInt({ min: 0, max: 50 }).withMessage("experience must be in range of 0-50"),
    (0, express_validator_1.body)('data.*.password')
        .trim()
        .notEmpty().withMessage("Password is Required")
        .isLength({ min: 8 }).withMessage("Password length must be greater than 8 characters"),
    handleValidationError
];
exports.validateStaffCSV = validateStaffCSV;
