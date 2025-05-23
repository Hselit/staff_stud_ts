import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { Parser } from "json2csv";
import dotenv from "dotenv";
dotenv.config();

import { readCsvFile } from "../service/readcsv";
import db from "../models/index";
import transporter from "../service/sendMail";
const { Staff, Student, Email, sequelize } = db;
import {
  StaffBase,
  StaffDelete,
  StaffStudentData,
  emailRequest,
  staffId,
  staffLoginRequest,
  staffResponse,
  updateStaffData,
  updatecount,
} from "./dto/staff.dto";
import { StudentBase } from "./dto/student.dto";
import { EmailAttributes } from "../models/email";

// staff login
export const staffLogin = async function (req: Request, res: Response): Promise<void> {
  try {
    const reqdata: staffLoginRequest = req.body;
    const data: StaffBase | null = await Staff.findOne({ where: { staffName: reqdata.staffName } });
    // console.log(data);
    // const role = data.
    if (!data) {
      const response: staffResponse = {
        message: "No Staff fouund with the name",
      };
      res.status(400).json(response);
      return;
    }
    if (reqdata.password != data.password) {
      const response: staffResponse = {
        message: "Invalid Password",
      };
      res.status(400).json(response);
      return;
    }
    const token: string = jwt.sign(
      { staffName: data.staffName, password: data.password, role: data.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    //  console.log(token);
    const response: staffResponse = {
      message: "Logged In success",
      token: token,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    const response: staffResponse = {
      message: "Internal Server Error",
    };
    res.status(500).json(response);
    return;
  }
};

// get all staff
export const getStaff = async function (req: Request, res: Response): Promise<void> {
  try {
    const data = await Staff.findAll();
    if (data.length == 0) {
      res.status(200).json({ message: "No Staff Found.." } as staffResponse);
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    const response: staffResponse = {
      message: "Error Occured",
    };
    res.status(500).json(response);
    return;
  }
};

// get single staff
export const getStaffById = async (req: Request, res: Response): Promise<void> => {
  try {
    const staffdt: staffId = {
      id: Number(req.params.id),
    };
    const data: StaffBase | null = await Staff.findByPk(staffdt.id);
    if (!data) {
      const response: staffResponse = {
        message: "No staff found with the id",
      };
      res.status(404).json(response);
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    const response: staffResponse = {
      message: "Error Occured",
    };
    res.status(500).json(response);
    return;
  }
};

// create staff
export const createStaff = async function (req: Request, res: Response): Promise<void> {
  try {
    const dt: StaffBase = req.body;
    if (!dt.staffName || !dt.experience || !dt.role || !dt.password || !dt.email) {
      const resp: staffResponse = {
        message: "All Fields Required",
      };
      res.status(400).json(resp);
      return;
    }
    await Staff.create({
      staffName: dt.staffName,
      role: dt.role,
      experience: dt.experience,
      password: dt.password,
      email: dt.email,
    });
    const response: staffResponse = {
      message: "Staff Added Successfully",
    };
    res.status(201).json(response);
  } catch (error) {
    console.log("Error Occured ", error);
    const response: staffResponse = {
      message: "Internal Server Error",
    };
    res.status(500).json(response);
    return;
  }
};

// update staff
export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramsid: staffId = {
      id: Number(req.params.id),
    };
    const bodydata: updateStaffData = req.body;

    const checkexistdata: StaffBase | null = await Staff.findByPk(paramsid.id);
    console.log(checkexistdata);
    if (!checkexistdata) {
      const response: staffResponse = {
        message: "No staff found with the  id",
      };
      res.status(404).json(response);
      return;
    }
    const dt: updatecount = await Staff.update(
      {
        staffName: bodydata.staffName,
        role: bodydata.role,
        experience: bodydata.experience,
        password: bodydata.password,
      },
      { where: { id: paramsid.id } }
    );
    if (dt[0] === 1) {
      const response: staffResponse = {
        message: "Staff updated successfully",
      };
      res.status(200).json(response);
    }
    const response: staffResponse = {
      message: "No Changes Made",
    };
    res.status(400).json(response);
  } catch (error) {
    console.log(error);
    const response: staffResponse = {
      message: "Internal Server Error",
    };
    res.status(500).json(response);
    return;
  }
};

// delete staff
export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleteId: staffId = {
      id: Number(req.params.id),
    };
    const result: StaffDelete | null = await Staff.findByPk(deleteId.id);
    if (!result) {
      const response: staffResponse = {
        message: "No Staff found with the id",
      };
      res.status(404).json(response);
      return;
    }
    await result.destroy();
    const response: staffResponse = {
      message: "Staff Deleted Successfully",
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" } as staffResponse);
    return;
  }
};

// get staff with student
export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const stId: staffId = {
      id: Number(req.params.id),
    };
    const result: StaffStudentData | null = await Staff.findByPk(stId.id, {
      include: {
        model: Student,
        attributes: ["studentName", "age", "marks"],
      },
      attributes: {
        exclude: ["password"],
      },
    });
    if (!result) {
      res.status(404).json({ message: "No Students Found for Staff" } as staffResponse);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" } as staffResponse);
    return;
  }
};

// get csv file middleware
export const getcsv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.file) {
    res.status(404).json({ message: "No CSV file uploaded" } as staffResponse);
    return;
  }
  console.log(__dirname);
  const filePath: string = path.join(__dirname, "../../uploads", req.file.filename);
  try {
    const csvData: string[] = await readCsvFile(filePath);
    req.body.data = csvData;
    console.log(csvData);
    next();
  } catch (error) {
    console.log("Error in Reading the csv file", error);
    next(error);
  }
};

// bulk insert csv data
export const bulkInsertFromcsv = async (req: Request, res: Response): Promise<void> => {
  try {
    const staffData = req.body.data;
    await Staff.bulkCreate(staffData);
    res.status(201).json({ message: "Staffs record Inserted..." } as staffResponse);
  } catch (error) {
    console.log("Error Occured ", error);
    res.status(500).json({ message: "Errror Occured " } as staffResponse);
    return;
  }
};

// export staff data
export const exportStaffData = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: StaffBase[] | null = await Staff.findAll({ raw: true });
    const fields = ["id", "staffName", "role", "experience", "password"];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const filepath: string = path.join(__dirname, "../../exports/staffs.csv");
    fs.writeFileSync(filepath, csv);

    res.download(filepath, "staffs.csv");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Occured " } as staffResponse);
  }
};

// forgot password - send mail
export const forgotpassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const bodydata: emailRequest = req.body;
    const user: StaffBase | null = await Staff.findOne({ where: { email: bodydata.email } });
    // console.log(user);
    if (!user) {
      res.status(404).json({ message: "User Not Found.." } as staffResponse);
    }
    const mailoptions: EmailAttributes | null = await Email.findOne({
      where: { type: bodydata.type },
    });
    console.log(mailoptions);
    if (!mailoptions) {
      res.status(404).json({ message: "No Mail Template found with this type" } as staffResponse);
      return;
    }
    await transporter.sendMail({ ...mailoptions, to: bodydata.email });
    res.status(200).json({ message: "Password Reset Link Send to your mail-id" } as staffResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Occured " } as staffResponse);
    return;
  }
};

// create staffs with student
export const createStaffWithStudent = async (req: Request, res: Response): Promise<void> => {
  const trans = await sequelize.transaction();
  try {
    const { staff, studentName, age, marks, password } = req.body;
    const newStaff: StaffBase = await Staff.create(staff, { transaction: trans });
    const newStudent: StudentBase = await Student.create(
      { studentName, password, age, marks, staff_id: newStaff.id },
      { transaction: trans }
    );
    console.log("new staff :", newStaff, "\n new Student :", newStudent);
    await trans.commit();
    res.status(201).json({
      message: "Created Successfully",
      staff: newStaff,
      student: newStudent,
    } as staffResponse);
  } catch (error) {
    await trans.rollback();
    console.log(error);
    res.status(500).json({ message: "Creation Failed" } as staffResponse);
    return;
  }
};

//reset password page
export const resetpage = async (req: Request, res: Response): Promise<void> => {
  console.log("in password verify route");
  res
    .status(200)
    .send(
      `<h3 style="text-align:center;">Password Reset Success</h3><br><h2 style="text-align:center;">Thank You.....</h2>`
    );
};
