import express from "express";
const router = express.Router();

import { AddEmailTemplate, fileToPdf, gethtmlcontent } from "../controller/emailController";
import { addEmailValidator } from "../middleware/mailValidator";
import { verifyToken } from "../middleware/UserAuthentication";
import upload from "../middleware/fileUpload";

/**
 * @swagger
 * tags:
 *   name: HTML
 *   description: Add HTML Templates to the Db
 */

/**
 * @swagger
 * /email/addtemplate:
 *   post:
 *     summary: Post HTML Templates
 *     tags:
 *       - HTML
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: HTML Template type
 *               to:
 *                 type: string
 *                 description: To Email Address
 *             required:
 *               - type
 *               - to
 *     responses:
 *       201:
 *         description: Created HTML Template
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: HTML template type
 *       500:
 *         description: Internal Server Error
 */
router.post("/addtemplate", verifyToken, addEmailValidator, AddEmailTemplate);

/**
 * @openapi
 * /email/topdf:
 *   post:
 *     summary: Convert File Content to PDF
 *     tags:
 *       - HTML
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Converted To PDF
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server Error
 *
 */
router.post("/topdf", upload.single("file"), fileToPdf);

/**
 * @openapi
 * /email/html:
 *   post:
 *     summary: Returns HTML Content with type
 *     tags:
 *       - HTML
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type used to fetch the HTML Template
 *             required:
 *               - type
 *     responses:
 *       200:
 *         description: PDF file returned
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No HTML Content found
 *       500:
 *         description: Internal Server Error
 */
router.post("/html", gethtmlcontent);

export default router;
