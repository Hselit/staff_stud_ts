"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const email_controller_1 = require("../controller/email.controller");
const mailValidator_1 = require("../middleware/mailValidator");
router.post("/addtemplate", mailValidator_1.addEmailValidator, email_controller_1.AddEmailTemplate);
exports.default = router;
