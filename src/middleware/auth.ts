import dotenv from "dotenv";
dotenv.config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthenticateRequest, ResponseModel } from "../controller/dto/common.dto";

const verifyToken = (req: AuthenticateRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res
      .status(401)
      .json({ message: "Authentication Required: No token provided" } as ResponseModel);
    return;
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === "string") {
      res.status(401).json({ message: "Unauthorized: Invalid token structure" } as ResponseModel);
      return;
    }
    req.user = decoded;
    console.log("Verified Successfully:", decoded);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized: Invalid Token" } as ResponseModel);
    return;
  }
};

const roleMiddleware = (req: AuthenticateRequest, res: Response, next: NextFunction): void => {
  const user = req.user as JwtPayload;
  if (!user || !["Admin"].includes(user.role)) {
    res.status(401).json({ message: "Forbidden:Access Denied" } as ResponseModel);
    return;
  }
  next();
};

// const roleMiddleware = (allowedRoles:string[])=>{
//    return (req:AuthenticateRequest,res:Response,next:NextFunction) =>{
//       const user = req.user as JwtPayload;
//       if(!user || !allowedRoles.includes(user.role)){
//          return res.status(401).json({message:"Forbidden:Access Denied"});
//       }
//       next();
//    }
// }

export { roleMiddleware, verifyToken };
