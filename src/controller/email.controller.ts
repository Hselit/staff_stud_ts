import { Request, Response } from "express";

import db from "../models/index";
import transporter from "../service/sendMail";
const { Email } = db;

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
