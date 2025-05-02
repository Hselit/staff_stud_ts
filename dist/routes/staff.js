"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const csvUpload_1 = __importDefault(require("../middleware/csvUpload"));
const staffValidator_1 = require("../middleware/staffValidator");
const auth_1 = require("../middleware/auth");
const staff_controller_1 = require("../controller/staff.controller");
//staff login
router.post('/stafflogin', staffValidator_1.validateStaffLogin, staff_controller_1.staffLogin);
//get staff method
router.get('/', auth_1.verifyToken, auth_1.roleMiddleware, staff_controller_1.getStaff);
//Bulk Insert using CSV
router.post('/csv', csvUpload_1.default.single('csv'), auth_1.verifyToken, auth_1.roleMiddleware, staff_controller_1.getcsv, staffValidator_1.validateStaffCSV, staff_controller_1.bulkInsertFromcsv);
//export data using csv
router.get('/export', auth_1.verifyToken, auth_1.roleMiddleware, staff_controller_1.exportStaffData);
//get single staff method
router.get('/:id', auth_1.verifyToken, auth_1.roleMiddleware, staffValidator_1.validateStaffId, staff_controller_1.getStaffById);
//staff post method
router.post('/', auth_1.verifyToken, auth_1.roleMiddleware, staffValidator_1.validateStaffCreate, staff_controller_1.createStaff);
//staff update method
router.put('/:id', auth_1.verifyToken, auth_1.roleMiddleware, staffValidator_1.validateStaffUpdate, staff_controller_1.updateStaff);
//staff delete method
router.delete('/:id', auth_1.verifyToken, auth_1.roleMiddleware, staffValidator_1.validateStaffId, staff_controller_1.deleteStaff);
//get staffs with students
router.get('/getallstudent/:id', auth_1.verifyToken, auth_1.roleMiddleware, staffValidator_1.validateStaffId, staff_controller_1.getStudents);
exports.default = router;
