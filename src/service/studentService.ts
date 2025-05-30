import { StudentBase, studentLogData, studId, updateStudentData } from "../dto/student.dto";
import db from "../models/index";
const { Staff, Student } = db;

export class StudentService {
  static async getStudentList() {
    try {
      return await Student.findAll();
    } catch (error) {
      console.log(error);
    }
  }

  static async addStudent(data: StudentBase) {
    try {
      return await Student.create(data);
    } catch (error) {
      console.log(error);
    }
  }

  static async getStudentByName(data: studentLogData) {
    try {
      return await Student.findOne({
        where: {
          studentName: data.studentName,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async getStudentById(data: studId) {
    try {
      return await Student.findByPk(data.id);
    } catch (error) {
      console.log(error);
    }
  }

  static async updateStudent(data: updateStudentData, sid: studId) {
    try {
      return await Student.update(data, {
        where: {
          id: sid,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteStudent(data: studId) {
    try {
      return await Student.destroy({ where: { id: data } });
    } catch (error) {
      console.log(error);
    }
  }

  static async getStudentAndStaff(sid: studId) {
    try {
      return await Student.findByPk(sid.id, {
        include: {
          model: Staff,
          attributes: {
            exclude: ["password"],
          },
        },
        attributes: {
          exclude: ["password"],
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async getStudentRawData() {
    try {
      return await Student.findAll({ raw: true });
    } catch (error) {
      console.log(error);
    }
  }
}
