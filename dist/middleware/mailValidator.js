"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEmailValidator = void 0;
const express_validator_1 = require("express-validator");
exports.addEmailValidator = [
    (0, express_validator_1.body)("type")
        .trim()
        .notEmpty()
        .withMessage("Type is required")
        .isString()
        .withMessage("Type Should be a string"),
    (0, express_validator_1.body)("from")
        .trim()
        .notEmpty()
        .withMessage("From should not be empty")
        .isEmail()
        .withMessage("Invalid Email Format"),
    (0, express_validator_1.body)("to")
        .trim()
        .notEmpty()
        .withMessage("To should not be empty")
        .isEmail()
        .withMessage("Invalid To Email Format"),
    handleValidationError,
];
function handleValidationError(req, res, next) {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
        return;
    }
    next();
}
