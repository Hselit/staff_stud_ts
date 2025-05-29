import express from "express";
const router = express.Router();

import {
  validateStudentUpdate,
  validateStudentCreate,
  validateStudentId,
  validateStudentLogin,
} from "../middleware/studentValidator";
import { verifyToken, roleMiddleware } from "../middleware/UserAuthentication";
import {
  getStudentList,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStaffs,
  createStudent,
  studentLogin,
  exportStudentData,
} from "../controller/studentController";
import upload from "../middleware/imageUpload";

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student Routes
 */

/**
 * @swagger
 * /student/studentlogin:
 *   post:
 *     summary: Student Login Route
 *     tags:
 *       - Student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentName:
 *                 type: string
 *                 description: Student Name
 *               password:
 *                 type: string
 *                 description: Student Password
 *             required:
 *               - studentName
 *               - password
 *     responses:
 *       200:
 *         description: Student Logged In Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Operation status
 *       400:
 *         description: Invalid Format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status Text
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status Text
 *
 */

// Student Login
router.post("/studentlogin", validateStudentLogin, studentLogin);

/**
 * @swagger
 * /student/:
 *   get:
 *     summary: Get all Student List
 *     tags:
 *       - Student
 *     responses:
 *       200:
 *         description: Get Student List Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     description: Unique Student Id
 *                   studentName:
 *                     type: string
 *                     description: Student Name
 *                   marks:
 *                     type: number
 *                     decription: Student Marks
 *                   age:
 *                     type: number
 *                     description: Student Age
 *                   password:
 *                     type: string
 *                     description: Student Password
 *                   profile:
 *                     type: string
 *                     description: Student Profile
 *                   staff_id:
 *                     type: number
 *                     description: Staff Id of the Student
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *
 */

//get student method
router.get("/", verifyToken, getStudentList);

//export data using csv
router.get("/export", verifyToken, roleMiddleware, exportStudentData);

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Get Student By Id
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Unqiue Id of Student
 *     responses:
 *       200:
 *         description: Get Student Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: Unique Student Id
 *                 studentName:
 *                   type: string
 *                   description: Student Name
 *                 marks:
 *                   type: number
 *                   description: Student Mark
 *                 age:
 *                   type: number
 *                   description: Student Age
 *                 password:
 *                   type: string
 *                   description: Student Password
 *                 profile:
 *                   type: string
 *                   description: Student Profile
 *                 staff_if:
 *                   type: number
 *                   description: Staff Id of the Student
 *       404:
 *         description: Student Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

//get single student method
router.get("/:id", verifyToken, roleMiddleware, validateStudentId, getStudentById);

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Create a new student
 *     tags:
 *       - Student
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - studentName
 *               - password
 *               - marks
 *               - age
 *               - staff_id
 *             properties:
 *               studentName:
 *                 type: string
 *                 description: Name of the student
 *               password:
 *                 type: string
 *                 description: Password of the student
 *               marks:
 *                 type: number
 *                 description: Marks scored by the student
 *               age:
 *                 type: number
 *                 description: Age of the student
 *               staff_id:
 *                 type: number
 *                 description: ID of the staff assigned to the student
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: Student profile image
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: student Added Successfully
 *       400:
 *         description: Bad Request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 */

//student post method
router.post("/", verifyToken, roleMiddleware, upload.single("profile"), validateStudentCreate, createStudent);

/**
 * @swagger
 * /student/{id}:
 *   put:
 *     summary: Update the Student Details
 *     tags:
 *       - Student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the student to update
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               studentName:
 *                 type: string
 *                 description: Student Name
 *               marks:
 *                 type: number
 *                 description: Student Marks
 *               age:
 *                 type: number
 *                 description: Student Age
 *               password:
 *                 type: string
 *                 description: Student Password
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: Student Profile
 *               staff_id:
 *                 type: number
 *                 description: Staff Id of the Student
 *     responses:
 *       404:
 *         description: No Student FOund with this Id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error Message
 *       200:
 *         description: Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status Message
 *       400:
 *         description: No Changes Made
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status Message
 *       500:
 *         description: Internal Server Errror
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   description: Status Message
 *
 */

//student update method
router.put(
  "/:id",
  verifyToken,
  roleMiddleware,
  upload.single("profile"),
  validateStudentUpdate,
  updateStudent
);

/**
 * @swagger
 * /student/{id}:
 *   delete:
 *     summary: Delete Student Data
 *     tags:
 *       - Student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique Id to Delete Student Data
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Student With the Id Deleted
 *         content:
 *           application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: object
 *                 description: Status Message
 *       404:
 *         description: No Student Found with the Id
 *         content:
 *           application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: object
 *                 description: Status Message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: object
 *                 description: Status Message
 *
 */

//staff delete method
router.delete("/:id", verifyToken, roleMiddleware, validateStudentId, deleteStudent);

//get student with staff
router.get("/getstaff/:id", verifyToken, roleMiddleware, validateStudentId, getStaffs);

export default router;
