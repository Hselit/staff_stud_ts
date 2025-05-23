import { Request, Response } from "express";
import fs from "fs";

import pdf, { CreateOptions } from "html-pdf";
import { promisify } from "util";
import db from "../models/index";
import transporter from "../service/sendMail";
import path from "path";
import {
  EmailData,
  emailResponse,
  emailType,
  errorResponse,
  HtmlData,
  sendEmail,
} from "./dto/email.dto";

const { Email, Html } = db;
promisify(pdf.create);

//send template through mail
export const AddEmailTemplate = async (req: Request, res: Response): Promise<void> => {
  const data: sendEmail = req.body;

  try {
    const mailoption: EmailData | null = await Email.findOne({ where: { type: data.type } });
    console.log(mailoption);
    if (!mailoption) {
      const response: errorResponse = {
        message: "No Mail Template found with this type",
      };
      res.status(404).json(response);
      return;
    }
    transporter.sendMail({ ...mailoption, from: data.from, to: data.to }, (error, info) => {
      if (error) {
        const response: errorResponse = {
          message: "Error in Sending Mail",
          error: error,
        };
        res.status(500).json(response);
      } else {
        const response: emailResponse = {
          message: "Mail Sent Success",
          info: info,
        };
        res.status(200).json(response);
      }
    });
  } catch (err) {
    const response: errorResponse = {
      message: "Server Error",
      error: err as Error,
    };
    res.status(500).json(response);
  }
};

//convert html file to pdf
export const fileToPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const file: string = req.file?.filename || "";
    const filepath: string = path.join(process.cwd(), "uploads", file); // use process.cwd()
    console.log(filepath);
    const html: string = fs.readFileSync(filepath, "utf8");
    const options: CreateOptions = { format: "A4" };
    pdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        console.log(err);
        const response: errorResponse = {
          message: "Failed to create PDF",
          error: err,
        };
        res.status(500).json(response);
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
    const response: errorResponse = {
      message: "Error reading uploaded file",
      error: error as Error,
    };
    res.status(500).json(response);
  }
};

export const readhtmlFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const file: string = req.file?.filename || "";
    const filepath: string = path.join(process.cwd(), "uploads", file); // use process.cwd()
    console.log(filepath);
    const html: string = fs.readFileSync(filepath, "utf8");
    console.log("HTML Content:", html);
    const response: errorResponse = {
      message: "File Read Successfully",
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error reading file:", error);
    const response: errorResponse = {
      message: "Error reading uploaded file",
      error: error as Error,
    };
    res.status(500).json(response);
  }
};

// get html content and display as pdf
export const gethtmlcontent = async (req: Request, res: Response): Promise<void> => {
  try {
    const emailtype: emailType = req.body;
    const htmlcontent: HtmlData | null = await Html.findOne({ where: { type: emailtype.type } });
    const htmlc = htmlcontent?.content as string;
    console.log(htmlc);
    const options: CreateOptions = { format: "A4" };
    if (!htmlc) {
      const response: errorResponse = {
        message: "No Html content found with this type",
      };
      res.status(404).json(response);
      return;
    }
    pdf.create(htmlc, options).toBuffer((err, buffer) => {
      if (err) {
        console.log(err);
        const response: errorResponse = {
          message: "Failed to create PDF",
          error: err,
        };
        res.status(500).json(response);
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
    const response: errorResponse = {
      message: "Error Occured",
      error: err as Error,
    };
    res.status(500).json(response);
  }
};
