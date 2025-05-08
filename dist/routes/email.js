"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const email_controller_1 = require("../controller/email.controller");
const mailValidator_1 = require("../middleware/mailValidator");
const auth_1 = require("../middleware/auth");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
router.post("/addtemplate", auth_1.verifyToken, mailValidator_1.addEmailValidator, email_controller_1.AddEmailTemplate);
router.post("/topdf", fileUpload_1.default.single("file"), email_controller_1.fileToPdf);
router.post("/html", email_controller_1.gethtmlfile);
exports.default = router;
