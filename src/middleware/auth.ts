require('dotenv').config();
import jwt,{JwtPayload} from 'jsonwebtoken';
import {Response,Request,NextFunction} from 'express';

interface AuthenticateRequest extends Request{
   user?:JwtPayload
}

const verifyToken = (req:AuthenticateRequest, res:Response, next:NextFunction):Response | void => {
   const token = req.headers["authorization"];

   console.log("Token Received:", token);

   if (!token) {
       return res.status(401).json({ message: "Authentication Required: No token provided" });
   }

   try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
       if (typeof decoded === 'string') {
          return res.status(401).json({ message: "Unauthorized: Invalid token structure" });
         }
         req.user = decoded;
         console.log("Verified Successfully:", decoded);
       next();
   } catch (error) {
       return res.status(401).json({ message: "Unauthorized: Invalid Token" });
   }
};

const roleMiddleware = (allowedRoles:string[])=>{
   return (req:AuthenticateRequest,res:Response,next:NextFunction) =>{
      const user = req.user as JwtPayload;
      if(!user || !allowedRoles.includes(user.role)){
         return res.status(401).json({message:"Forbidden:Access Denied"});
      }
      next();
   }
}

module.exports = {roleMiddleware,verifyToken};