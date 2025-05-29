import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { Parser } from "json2csv";
import dotenv from "dotenv";
dotenv.config();

import { readCsvFile } from "../utils/readCsv";
import transporter from "../utils/sendMail";
import {
  StaffBase,
  StaffDelete,
  StaffStudentResponse,
  emailRequest,
  staffId,
  staffLoginRequest,
  staffResponse,
  staffStudentRequest,
  updateStaffData,
} from "../dto/staff.dto";
import { EmailData } from "../dto/email.dto";
import { StaffService } from "../service/staffService";
import db from "../models/index";
import { EmailService } from "../service/emailService";
const { sequelize } = db;

// staff login
export const staffLogin = async function (req: Request, res: Response): Promise<void> {
  try {
    const loginRequest: staffLoginRequest = req.body;
    const data: StaffBase | null = await StaffService.getStaffByName(loginRequest);
    if (!data) {
      const response: staffResponse = {
        message: "No Staff fouund with the name",
      };
      res.status(400).json(response);
      return;
    }
    if (loginRequest.password != data.password) {
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
export const getAllStaff = async function (req: Request, res: Response): Promise<void> {
  try {
    const StaffListResponse: StaffBase[] = await StaffService.getStaffList();
    if (StaffListResponse.length == 0) {
      res.status(200).json({ message: "No Staff Found.." } as staffResponse);
      return;
    }
    res.status(200).json(StaffListResponse);
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
    const staffid: staffId = {
      id: Number(req.params.id),
    };
    const data: StaffBase | null = await StaffService.getStaffById(staffid);
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
    const createStaffData: StaffBase = req.body;
    if (
      !createStaffData.staffName ||
      !createStaffData.experience ||
      !createStaffData.role ||
      !createStaffData.password ||
      !createStaffData.email
    ) {
      const resp: staffResponse = { message: "All Fields Required" };
      res.status(400).json(resp);
      return;
    }
    await StaffService.addStaff(createStaffData);
    const response: staffResponse = { message: "Staff Added Successfully" };
    res.status(201).json(response);
  } catch (error) {
    console.log("Error Occured ", error);
    const response: staffResponse = { message: "Internal Server Error" };
    res.status(500).json(response);
    return;
  }
};

// update staff
export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staffid: staffId = {
      id: Number(req.params.id),
    };
    const bodydata: updateStaffData = req.body;

    const checkexistdata: StaffBase | null = await StaffService.getStaffById(staffid);
    console.log(checkexistdata);
    if (!checkexistdata) {
      const response: staffResponse = {
        message: "No staff found with the  id",
      };
      res.status(404).json(response);
      return;
    }
    const dt = await StaffService.updateStaff(bodydata, staffid);
    console.log(dt);
    if (dt[0] === 1) {
      const response: staffResponse = {
        message: "Staff updated successfully",
      };
      res.status(200).json(response);
    } else {
      const response: staffResponse = {
        message: "No Changes Made",
      };
      res.status(400).json(response);
    }
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
    const staffid: staffId = {
      id: Number(req.params.id),
    };
    const result: StaffDelete | null = await StaffService.getStaffById(staffid);
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
    const staffid: staffId = {
      id: Number(req.params.id),
    };
    const result: StaffStudentResponse | null = await StaffService.getStaffAndStudent(staffid);
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
    const staffData: StaffBase[] = req.body.data;
    await StaffService.addBulkStaff(staffData);
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
    const data: StaffBase[] | null = await StaffService.getStaffList();
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
    const user: StaffBase | null = await StaffService.getStaffByEmail(bodydata);
    // console.log(user);
    if (!user) {
      res.status(404).json({ message: "User Not Found.." } as staffResponse);
    }
    const mailoptions: EmailData | null = await EmailService.getEmailByType(bodydata);
    console.log(mailoptions);
    if (!mailoptions) {
      res.status(404).json({ message: "No Mail Template found with this type" } as staffResponse);
      return;
    }
    await transporter.sendMail({
      text: mailoptions.html,
      cc: mailoptions.cc,
      subject: mailoptions.subject,
      to: bodydata.email,
    });
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
    const staffStudentRequest: staffStudentRequest = req.body;
    await StaffService.addStaffAndStudent(trans, staffStudentRequest);
    await trans.commit();
    res.status(201).json({ message: "Created Successfully" } as staffResponse);
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
