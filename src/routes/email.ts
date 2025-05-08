import express from "express";
const router = express.Router();

import { AddEmailTemplate, fileToPdf, gethtmlfile } from "../controller/email.controller";
import { addEmailValidator } from "../middleware/mailValidator";
import { verifyToken } from "../middleware/auth";
import upload from "../middleware/fileUpload";

router.post("/addtemplate", verifyToken, addEmailValidator, AddEmailTemplate);

router.post("/topdf", upload.single("file"), fileToPdf);

router.post("/html", gethtmlfile);

export default router;
