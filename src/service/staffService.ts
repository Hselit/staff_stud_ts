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
    try {
      return await Staff.findAll();
    } catch (error) {
      console.log(error);
    }
  }

  static async getStaffById(sid: staffId) {
    try {
      return await Staff.findByPk(sid.id);
    } catch (error) {
      console.log(error);
    }
  }

  static async updateStaff(staffData: updateStaffData, sid: staffId) {
    try {
      return await Staff.update(staffData, { where: { id: sid.id } });
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteStaff(sid: staffId) {
    try {
      return await Staff.destroy({ where: { id: sid.id } });
    } catch (error) {
      console.log(error);
    }
  }

  static async getStaffAndStudent(sid: staffId) {
    try {
      return await Staff.findByPk(sid.id, {
        include: {
          model: Student,
          attributes: ["studentName", "age", "marks"],
        },
        attributes: {
          exclude: ["password"],
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async getStaffByName(staffData: staffLoginRequest) {
    try {
      return await Staff.findOne({ where: { staffName: staffData.staffName } });
    } catch (error) {
      console.log(error);
    }
  }

  static async addStaff(staffdata: StaffBase) {
    try {
      return await Staff.create(staffdata);
    } catch (error) {
      console.log(error);
    }
  }

  static async addBulkStaff(staffdata: StaffBase[]) {
    try {
      return await Staff.bulkCreate(staffdata);
    } catch (error) {
      console.log(error);
    }
  }

  static async getStaffByEmail(sdata: emailRequest) {
    try {
      return await Staff.findOne({ where: { email: sdata.email } });
    } catch (error) {
      console.log(error);
    }
  }

  static async addStaffAndStudent(t: Transaction, staffstudentdata: staffStudentRequest) {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }
}
