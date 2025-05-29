import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const addEmailValidator = [
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isString()
    .withMessage("Type Should be a string"),

  body("to")
    .trim()
    .notEmpty()
    .withMessage("To should not be empty")
    .isEmail()
    .withMessage("Invalid To Email Format"),

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
