"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const csvUpload_1 = __importDefault(require("../middleware/csvUpload"));
const staffValidator_1 = require("../middleware/staffValidator");
const auth_1 = require("../middleware/auth");
const staff_controller_1 = require("../controller/staff.controller");
//staff login
router.post("/stafflogin", staffValidator_1.validateStaffLogin, staff_controller_1.staffLogin);
//get staff method
router.get("/", auth_1.verifyToken, auth_1.roleMiddleware, staff_controller_1.getStaff);
//Bulk Insert using CSV
router.post(
  "/csv",
  csvUpload_1.default.single("csv"),
  auth_1.verifyToken,
  auth_1.roleMiddleware,
  staff_controller_1.getcsv,
  staffValidator_1.validateStaffCSV,
  staff_controller_1.bulkInsertFromcsv
);
//export data using csv
router.get(
  "/export",
  auth_1.verifyToken,
  auth_1.roleMiddleware,
  staff_controller_1.exportStaffData
);
router.post("/forgotpassword", staff_controller_1.forgotpassword);
router.get("/passwordreset", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log("in password verify route");
    res
      .status(200)
      .send(
        `<h3 style="text-align:center;">Password Reset Success</h3><br><h2 style="text-align:center;">Thank You.....</h2>`
      );
  })
);
//get single staff method
router.get(
  "/:id",
  auth_1.verifyToken,
  auth_1.roleMiddleware,
  staffValidator_1.validateStaffId,
  staff_controller_1.getStaffById
);
//staff post method
router.post(
  "/",
  auth_1.verifyToken,
  auth_1.roleMiddleware,
  staffValidator_1.validateStaffCreate,
  staff_controller_1.createStaff
);
//staff update method
router.put(
  "/:id",
  auth_1.verifyToken,
  auth_1.roleMiddleware,
  staffValidator_1.validateStaffUpdate,
  staff_controller_1.updateStaff
);
//staff delete method
router.delete(
  "/:id",
  auth_1.verifyToken,
  auth_1.roleMiddleware,
  staffValidator_1.validateStaffId,
  staff_controller_1.deleteStaff
);
//get staffs with students
router.get(
  "/getallstudent/:id",
  auth_1.verifyToken,
  auth_1.roleMiddleware,
  staffValidator_1.validateStaffId,
  staff_controller_1.getStudents
);
exports.default = router;
