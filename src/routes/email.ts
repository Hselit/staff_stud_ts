import express from "express";
const router = express.Router();

import { AddEmailTemplate } from "../controller/email.controller";
import { addEmailValidator } from "../middleware/mailValidator";
import { verifyToken } from "../middleware/auth";

router.post("/addtemplate", verifyToken, addEmailValidator, AddEmailTemplate);

export default router;
