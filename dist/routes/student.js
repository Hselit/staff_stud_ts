"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const studentValidator_1 = require("../middleware/studentValidator");
const auth_1 = require("../middleware/auth");
const student_controller_1 = require("../controller/student.controller");
const imageUpload_1 = __importDefault(require("../middleware/imageUpload"));
// Student Login
router.post("/studentlogin", studentValidator_1.validateStudentLogin, student_controller_1.studentLogin);
//get student method
router.get("/", auth_1.verifyToken, student_controller_1.getStudent);
//export data using csv
router.get("/export", auth_1.verifyToken, auth_1.roleMiddleware, student_controller_1.exportStudentData);
//get single student method
router.get("/:id", auth_1.verifyToken, auth_1.roleMiddleware, studentValidator_1.validateStudentId, student_controller_1.getStudentById);
//student post method
router.post("/", auth_1.verifyToken, auth_1.roleMiddleware, imageUpload_1.default.single("profile"), studentValidator_1.validateStudentCreate, student_controller_1.createStudent);
//student update method
router.put("/:id", auth_1.verifyToken, auth_1.roleMiddleware, imageUpload_1.default.single("profile"), studentValidator_1.validateStudentUpdate, student_controller_1.updateStudent);
//staff delete method
router.delete("/:id", auth_1.verifyToken, auth_1.roleMiddleware, studentValidator_1.validateStudentId, student_controller_1.deleteStudent);
//get student with staff
router.get("/getstaff/:id", auth_1.verifyToken, auth_1.roleMiddleware, studentValidator_1.validateStudentId, student_controller_1.getStaffs);
exports.default = router;
