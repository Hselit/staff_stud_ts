import express from "express";
const router = express.Router();

import uploadcsv from "../middleware/csvUpload";
import {
  validateStaffId,
  validateStaffCreate,
  validateStaffUpdate,
  validateStaffLogin,
  validateStaffCSV,
  validateStaffCreateWithStudent,
} from "../middleware/staffValidator";

import { verifyToken, roleMiddleware } from "../middleware/auth";
import {
  bulkInsertFromcsv,
  createStaff,
  createStaffWithStudent,
  deleteStaff,
  exportStaffData,
  forgotpassword,
  getcsv,
  getStaff,
  getStaffById,
  getStudents,
  resetpage,
  staffLogin,
  updateStaff,
} from "../controller/staff.controller";

//staff login
router.post("/stafflogin", validateStaffLogin, staffLogin);

// create staff with student
router.post("/addstaffstudent", validateStaffCreateWithStudent, createStaffWithStudent);

//get staff method
router.get("/", verifyToken, roleMiddleware, getStaff);

//Bulk Insert using CSV
router.post(
  "/csv",
  uploadcsv.single("csv"),
  verifyToken,
  roleMiddleware,
  getcsv,
  validateStaffCSV,
  bulkInsertFromcsv
);

//export data using csv
router.get("/export", verifyToken, roleMiddleware, exportStaffData);

//forgot password route - send mail
router.post("/forgotpassword", forgotpassword);

// password reset route
router.get("/passwordreset", resetpage);

//get single staff method
router.get("/:id", verifyToken, roleMiddleware, validateStaffId, getStaffById);

//staff post method
router.post("/", verifyToken, roleMiddleware, validateStaffCreate, createStaff);

//staff update method
router.put("/:id", verifyToken, roleMiddleware, validateStaffUpdate, updateStaff);

//staff delete method
router.delete("/:id", verifyToken, roleMiddleware, validateStaffId, deleteStaff);

//get staffs with students
router.get("/getallstudent/:id", verifyToken, roleMiddleware, validateStaffId, getStudents);

export default router;
