import express from "express";
const router = express.Router();

import uploadcsv from "../middleware/csvUpload";
import {
  validateStaffId,
  validateStaffCreate,
  validateStaffUpdate,
  validateStaffLogin,
  validateStaffCSV,
} from "../middleware/staffValidator";
import { verifyToken, roleMiddleware } from "../middleware/auth";
import {
  bulkInsertFromcsv,
  createStaff,
  deleteStaff,
  exportStaffData,
  forgotpassword,
  getcsv,
  getStaff,
  getStaffById,
  getStudents,
  staffLogin,
  updateStaff,
} from "../controller/staff.controller";

//staff login
router.post("/stafflogin", validateStaffLogin, staffLogin);

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

router.post("/forgotpassword", forgotpassword);

router.get("/passwordreset", async (req, res) => {
  console.log("in password verify route");
  res
    .status(200)
    .send(
      `<h3 style="text-align:center;">Password Reset Success</h3><br><h2 style="text-align:center;">Thank You.....</h2>`
    );
});

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
