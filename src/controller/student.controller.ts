/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parser } from "json2csv";
import db from "../models/index";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
const { staff, student } = db;
import fs from "fs";
import path from "path";

export const getStudent = async function (req: Request, res: Response): Promise<void> {
  try {
    const data = await student.findAll();
    if (data.length == 0) {
      res.status(200).json({ message: "No student Found.." });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const studentLogin = async function (req: Request, res: Response): Promise<void> {
  try {
    const { studentName, password } = req.body;
    const data = await student.findOne({ where: { studentName } });
    if (!data) {
      res.status(400).json({ message: "No Student found with the name" });
      return;
    }
    if (password != data.password) {
      res.status(400).json({ message: "Invalid Password" });
      return;
    }
    const role = "student";
    console.log({ studentName: data.studentName, password: data.password, role: role });
    const token = jwt.sign(
      { studentName: data.studentName, password: data.password, role: role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Logged In Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await student.findByPk(id);
    console.log(data);
    if (!data) {
      res.status(404).json({ message: "No student found with the Id" });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const createStudent = async function (req: Request, res: Response) {
  try {
    const { studentName, password, marks, age, staff_id } = req.body;
    const profile = req.file ? req.file.filename : null;

    // if(!staffName || !experience || !role){
    //   return res.status(400).json({message:"All Fields Required"});
    // }
    await student.create({ studentName, password, age, marks, staff_id, profile });
    res.status(201).json({ message: "student Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { studentName, marks, age, staff_id, password } = req.body;
    const image = req.file ? req.file?.filename : null;
    // console.log("req.file ",req.body.file)
    // console.log("image ",image);
    // console.log("student Name ",studentName,"Age ",age,"marks ",marks,"pass ",password);
    // if(!studentName || !marks || !age ||!staff_id){
    //   return res.status(400).json({message:"All fields are required"});
    // }

    const checkexistdata = await student.findByPk(id);
    // console.log(checkexistdata);
    if (!checkexistdata) {
      res.status(404).json({ message: "Not student found with the id" });
      return;
    }
    // console.log("req.file:", req.file);
    // console.log("Image filename:", image);

    const updateData: any = { studentName, marks, age, staff_id, password };
    if (image) {
      // console.log("inside image");
      updateData.profile = image;
    }

    // console.log("Update Data:", updateData);

    const dt = await student.update(updateData, { where: { id } });
    // console.log(dt);
    if (dt[0] === 1) {
      res.status(200).json({ message: "student updated successfully" });
      return;
    }
    res.status(400).json({ message: "No changes made" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await student.findByPk(id);
    if (!result) {
      res.status(404).json({ message: "No student found with the Id" });
      return;
    }
    await result.destroy();
    res.status(200).json({ message: "student Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getStaffs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await staff.findByPk(id, {
      include: {
        model: student,
        attribute: {
          exclude: ["password"],
        },
      },
      attribute: {
        exclude: ["password"],
      },
    });
    if (!result) {
      res.status(404).json({ message: "No Staff Found" });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const exportStudentData = async (req: Request, res: Response) => {
  try {
    const data = await student.findAll({ raw: true });
    const fields = ["id", "studentName", "marks", "age", "password", "profile", "staff_id"];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const filepath = path.join(__dirname, "../../exports/students.csv");
    fs.writeFileSync(filepath, csv);

    res.download(filepath, "students.csv");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Occured ", error });
  }
};
