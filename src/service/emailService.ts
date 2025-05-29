import { emailRequest } from "../dto/staff.dto";
import db from "../models/index";
const { Email } = db;

export class EmailService {
  static async getEmailByType(typedata: emailRequest) {
    return await Email.findOne({ where: { type: typedata.type } });
  }
}
