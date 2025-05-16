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

export const staffLogin = async function (req: Request, res: Response): Promise<void> {
  try {
    const { staffName, password } = req.body;
    const data = await Staff.findOne({ where: { staffName } });
    // console.log(data);
    // const role = data.
    if (!data) {
      res.status(400).json({ message: "No Staff found with the name" });
      return;
    }
    if (password != data.password) {
      res.status(400).json({ message: "Invalid Password" });
      return;
    }
    const token = jwt.sign(
      { staffName: data.staffName, password: data.password, role: data.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    //  console.log(token);
    res.status(200).json({ message: "Logged In Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getStaff = async function (req: Request, res: Response): Promise<void> {
  try {
    const data = await Staff.findAll();
    if (data.length == 0) {
      res.status(200).json({ message: "No Staff Found.." });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getStaffById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await Staff.findByPk(id);
    if (!data) {
      res.status(404).json({ message: "No Staff found with the Id" });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const createStaff = async function (req: Request, res: Response): Promise<void> {
  try {
    const { staffName, role, experience, password, email } = req.body;
    if (!staffName || !experience || !role || !password || !email) {
      res.status(400).json({ message: "All Fields Required" });
      return;
    }
    await Staff.create({ staffName, role, experience, password, email });
    res.status(201).json({ message: "Staff Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { staffName, role, experience, password } = req.body;

    // if(!staffName || !role || !experience){
    //   return res.status(400).json({message:"All fields are required"});
    // }

    const checkexistdata = await Staff.findByPk(id);
    console.log(checkexistdata);
    if (!checkexistdata) {
      res.status(404).json({ message: "Not Staff found with the id" });
      return;
    }
    const dt = await Staff.update({ staffName, role, experience, password }, { where: { id } });
    if (dt[0] === 1) {
      res.status(200).json({ message: "Staff updated successfully" });
      return;
    }
    res.status(400).json({ message: "No changes made" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Staff.findByPk(id);
    if (!result) {
      res.status(404).json({ message: "No Staff found with the Id" });
      return;
    }
    await result.destroy();
    res.status(200).json({ message: "Staff Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await Staff.findByPk(id, {
      include: {
        model: Student,
        attributes: ["studentName", "age", "marks"],
      },
      attributes: {
        exclude: ["password"],
      },
    });
    if (!result) {
      res.status(404).json({ message: "No Students Found for Staff" });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getcsv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.file) {
    res.status(404).json({ error: "No CSV file uploaded" });
    return;
  }
  console.log(__dirname);
  const filePath = path.join(__dirname, "../../uploads", req.file.filename);
  try {
    const csvData = await readCsvFile(filePath);
    req.body.data = csvData;
    console.log(csvData);
    next();
    // res.status(200).json({message:"CSV file proocessed successfully",data:csvData});
  } catch (error) {
    console.log("Error in Reading the csv file");
    // return res.status(500).json({error:"Error processing csv file "});
    next(error);
  }
};

export const bulkInsertFromcsv = async (req: Request, res: Response): Promise<void> => {
  try {
    const staffData = req.body.data;
    // const InsertData = staffData.map(row =>)
    await Staff.bulkCreate(staffData);
    res.status(201).json({ message: "Staffs record Inserted..." });
  } catch (error) {
    console.log("Error Occured ", error);
    res.status(500).json({ message: "Errror Occured ", error });
  }
};

export const exportStaffData = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Staff.findAll({ raw: true });
    const fields = ["id", "staffName", "role", "experience", "password"];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const filepath = path.join(__dirname, "../../exports/staffs.csv");
    fs.writeFileSync(filepath, csv);

    res.download(filepath, "staffs.csv");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Occured ", error });
  }
};

export const forgotpassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, type } = req.body;
    const user = await Staff.findOne({ where: { email: email } });
    console.log(email);
    // console.log(user);
    if (!user) {
      res.status(404).json({ message: "User Not Found.." });
    }
    // const token = crypto.randomBytes(32).toString("hex");
    // const resetLink = `http://localhost:3000/staff/passwordreset?token=${token}`;
    // const MailOptions: MailOptions = {
    //   from: process.env.MAIL_USER,
    //   to: user.email,
    //   subject: "Password Reset request",
    //   html: `<p>For resetting your password... Click <a href="${resetLink}">here</a>`,
    // };
    // sendMail(MailOptions);
    const mailoptions = await Email.findOne({ where: { type: type } });
    console.log(mailoptions);
    if (!mailoptions) {
      res.status(404).json({ message: "No Mail Template found with this type" });
      return;
    }
    await transporter.sendMail({ ...mailoptions.dataValues, to: email });
    res.status(200).json({ message: "Password Reset Link Send to your mail-id" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Occured ", error });
  }
};

export const createStaffWithStudent = async (req: Request, res: Response) => {
  const trans = await sequelize.transaction();
  try {
    const { staff, studentName, age, marks, password } = req.body;
    const newStaff = await Staff.create(staff, { transaction: trans });
    const newStudent = await Student.create(
      { studentName, password, age, marks, staff_id: newStaff.id },
      { transaction: trans }
    );
    console.log("new staff :", newStaff, "\n new Student :", newStudent);
    await trans.commit();
    res.status(201).json({ message: "Created Successfully", staff: newStaff, student: newStudent });
  } catch (error) {
    await trans.rollback();
    console.log(error);
    res.status(500).json({ message: "Creation Failed", error: error });
  }
};

export const resetpage = async (req: Request, res: Response) => {
  console.log("in password verify route");
  res
    .status(200)
    .send(
      `<h3 style="text-align:center;">Password Reset Success</h3><br><h2 style="text-align:center;">Thank You.....</h2>`
    );
};
