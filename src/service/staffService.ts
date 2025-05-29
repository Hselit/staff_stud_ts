import { Transaction } from "sequelize";
import {
  emailRequest,
  StaffBase,
  staffId,
  staffLoginRequest,
  staffStudentRequest,
  updateStaffData,
} from "../dto/staff.dto";
import db from "../models/index";
const { Staff, Student } = db;

export class StaffService {
  static async getStaffList() {
    return await Staff.findAll();
  }

  static async getStaffById(sid: staffId) {
    return await Staff.findByPk(sid.id);
  }

  static async updateStaff(staffData: updateStaffData, sid: staffId) {
    return await Staff.update(staffData, { where: { id: sid.id } });
  }

  static async deleteStaff(sid: staffId) {
    return await Staff.destroy({ where: { id: sid.id } });
  }

  static async getStaffAndStudent(sid: staffId) {
    return await Staff.findByPk(sid.id, {
      include: {
        model: Student,
        attributes: ["studentName", "age", "marks"],
      },
      attributes: {
        exclude: ["password"],
      },
    });
  }

  static async getStaffByName(staffData: staffLoginRequest) {
    return await Staff.findOne({ where: { staffName: staffData.staffName } });
  }

  static async addStaff(staffdata: StaffBase) {
    return await Staff.create(staffdata);
  }

  static async addBulkStaff(staffdata: StaffBase[]) {
    return await Staff.bulkCreate(staffdata);
  }

  static async getStaffByEmail(sdata: emailRequest) {
    return await Staff.findOne({ where: { email: sdata.email } });
  }

  static async addStaffAndStudent(t: Transaction, staffstudentdata: staffStudentRequest) {
    const newStaff: StaffBase = await Staff.create(
      {
        email: staffstudentdata.email,
        experience: staffstudentdata.experience,
        password: staffstudentdata.password,
        role: staffstudentdata.role,
        staffName: staffstudentdata.staffName,
      },
      { transaction: t }
    );
    await Student.create(
      {
        studentName: staffstudentdata.students.studentName,
        age: staffstudentdata.students.age,
        marks: staffstudentdata.students.marks,
        password: staffstudentdata.students.password,
        staff_id: newStaff.id,
      },
      { transaction: t }
    );
  }
}
