import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface AuthenticateRequest extends Request {
  user?: JwtPayload;
}

export interface ResponseModel {
  message: string;
  error?: Error;
}
