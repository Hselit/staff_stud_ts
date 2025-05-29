import { StudentBase, studentLogData, studId, updateStudentData } from "../dto/student.dto";
import db from "../models/index";
const { Staff, Student } = db;

export class StudentService {
  static async getStudentList() {
    return await Student.findAll();
  }

  static async addStudent(data: StudentBase) {
    return await Student.create(data);
  }

  static async getStudentByName(data: studentLogData) {
    return await Student.findOne({
      where: {
        studentName: data.studentName,
      },
    });
  }

  static async getStudentById(data: studId) {
    return await Student.findByPk(data.id);
  }

  static async updateStudent(data: updateStudentData, sid: studId) {
    return await Student.update(data, {
      where: {
        id: sid,
      },
    });
  }

  static async deleteStudent(data: studId) {
    return await Student.destroy({ where: { id: data } });
  }

  static async getStudentAndStaff(sid: studId) {
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
  }

  static async getStudentRawData() {
    return await Student.findAll({ raw: true });
  }
}
