import { Request, Response } from "express";
import fs from "fs";

import pdf, { CreateOptions } from "html-pdf";
import { promisify } from "util";
import db from "../models/index";
import transporter from "../service/sendMail";
import path from "path";

const { Email, Html } = db;

const createPdf = promisify(pdf.create);
console.log("createpdf " + createPdf);
export const AddEmailTemplate = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const { type, from, to } = data;

  try {
    const mailoption = await Email.findOne({ where: { type: type } });
    console.log(mailoption);

    if (!mailoption) {
      res.status(404).json({ message: "No Mail Template found with this type" });
      return;
    }

    transporter.sendMail({ ...mailoption.dataValues, from, to }, (error, info) => {
      if (error) {
        res.status(500).json({ message: "Error in Sending Mail" });
      } else {
        res.status(200).json({ message: "Mail Sent Success", info });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};

export const fileToPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file?.filename || "";
    const filepath = path.join(process.cwd(), "uploads", file); // use process.cwd()
    console.log(filepath);
    const html = fs.readFileSync(filepath, "utf8");
    const options: CreateOptions = { format: "A4" };
    pdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create PDF" });
        return;
      }
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=converted.pdf",
        "Content-Length": buffer.length,
      });
      res.send(buffer);
    });
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ message: "Error reading uploaded file" });
  }
};

export const readhtmlFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file?.filename || "";
    const filepath = path.join(process.cwd(), "uploads", file); // use process.cwd()
    console.log(filepath);
    const html = fs.readFileSync(filepath, "utf8");
    console.log("HTML Content:", html);
    res.status(200).json({ message: "File read successfully" });
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ message: "Error reading uploaded file" });
  }
};

export const gethtmlfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.body;
    const htmlcontent = await Html.findOne({ where: { type: type } });
    const htmlc = htmlcontent?.dataValues.content as string;
    console.log(htmlc);
    const options: CreateOptions = { format: "A4" };
    if (!htmlc) {
      res.status(500).json({ message: "No html content found with this type" });
      return;
    }
    pdf.create(htmlc, options).toBuffer((err, buffer) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create PDF" });
        return;
      }
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=converted.pdf",
        "Content-Length": buffer.length,
      });
      res.send(buffer);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error Occured ", err });
  }
};
