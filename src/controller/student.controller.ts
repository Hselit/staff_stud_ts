/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parser } from "json2csv";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

import db from "../models/index";
const { Staff, Student } = db;
import {
  StudentBase,
  StudentDelete,
  studentResponse,
  studentStaff,
  studId,
  studentLogData,
  updatecount,
} from "./dto/student.dto";

// get all student
export const getStudent = async function (req: Request, res: Response): Promise<void> {
  try {
    const data: StudentBase[] | null = await Student.findAll();
    if (data.length == 0) {
      res.status(200).json({ message: "No student Found.." } as studentResponse);
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" } as studentResponse);
    return;
  }
};

// student login
export const studentLogin = async function (req: Request, res: Response): Promise<void> {
  try {
    const logindata: studentLogData = req.body;
    const data: StudentBase | null = await Student.findOne({
      where: { studentName: logindata.studentName },
    });
    if (!data) {
      res.status(400).json({ message: "No Student found with the name" } as studentResponse);
      return;
    }
    if (logindata.password != data.password) {
      res.status(400).json({ message: "Invalid Password" } as studentResponse);
      return;
    }
    const role = "student";
    console.log({ studentName: data.studentName, password: data.password, role: role });
    const token = jwt.sign(
      { studentName: data.studentName, password: data.password, role: role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Logged In Successfully", token: token } as studentResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" } as studentResponse);
    return;
  }
};

// get student by id
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramid: studId = {
      id: Number(req.params.id),
    };
    const data: StudentBase | null = await Student.findByPk(paramid.id);
    console.log(data);
    if (!data) {
      res.status(404).json({ message: "No student found with the Id" } as studentResponse);
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" } as studentResponse);
    return;
  }
};

// create student
export const createStudent = async function (req: Request, res: Response): Promise<void> {
  try {
    const bodydata: StudentBase = req.body;
    const profile = req.file ? req.file.filename : null;

    // if(!staffName || !experience || !role){
    //   return res.status(400).json({message:"All Fields Required"});
    // }
    await Student.create({
      studentName: bodydata.studentName,
      password: bodydata.password,
      age: bodydata.age,
      marks: bodydata.marks,
      staff_id: bodydata.staff_id,
      profile,
    });
    res.status(201).json({ message: "student Added Successfully" } as studentResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" } as studentResponse);
    return;
  }
};

// update student
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramid: studId = {
      id: Number(req.params.id),
    };
    const { studentName, marks, age, staff_id, password } = req.body;
    const image = req.file ? req.file?.filename : null;

    const checkexistdata: StudentBase | null = await Student.findByPk(paramid.id);
    // console.log(checkexistdata);
    if (!checkexistdata) {
      res.status(404).json({ message: "Not student found with the id" } as studentResponse);
      return;
    }

    const updateData: any = { studentName, marks, age, staff_id, password };
    if (image) {
      // console.log("inside image");
      updateData.profile = image;
    }
    // console.log("Update Data:", updateData);
    const dt: updatecount = await Student.update(updateData, { where: { id: paramid.id } });
    // console.log(dt);
    if (dt[0] === 1) {
      res.status(200).json({ message: "student updated successfully" } as studentResponse);
      return;
    }
    res.status(400).json({ message: "No changes made" } as studentResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" } as studentResponse);
    return;
  }
};

// delete student
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramsid: studId = {
      id: Number(req.params.id),
    };
    const result: StudentDelete | null = await Student.findByPk(paramsid.id);
    if (!result) {
      res.status(404).json({ message: "No student found with the Id" } as studentResponse);
      return;
    }
    await result.destroy();
    res.status(200).json({ message: "student Deleted Successfully" } as studentResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server Error" } as studentResponse);
    return;
  }
};

// get students with staff
export const getStaffs = async (req: Request, res: Response): Promise<void> => {
  try {
    const sid: studId = {
      id: Number(req.params.id),
    };
    const result: studentStaff | null = await Student.findByPk(sid.id, {
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
    if (!result) {
      res.status(404).json({ message: "No Staff Found" } as studentResponse);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" } as studentResponse);
    return;
  }
};

// export student data
export const exportStudentData = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: StudentBase[] = await Student.findAll({ raw: true });
    const fields: string[] = [
      "id",
      "studentName",
      "marks",
      "age",
      "password",
      "profile",
      "staff_id",
    ];
    const parser = new Parser({ fields });
    const csv: string = parser.parse(data);

    const filepath: string = path.join(__dirname, "../../exports/students.csv");
    fs.writeFileSync(filepath, csv);
    res.download(filepath, "students.csv");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Occured " } as studentResponse);
    return;
  }
};
