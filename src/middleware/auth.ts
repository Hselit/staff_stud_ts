require('dotenv').config();
import jwt,{JwtPayload} from 'jsonwebtoken';
import {Response,Request,NextFunction} from 'express';

interface AuthenticateRequest extends Request{
   user?:JwtPayload
}

const verifyToken = (req:AuthenticateRequest, res:Response, next:NextFunction): void => {
   const token = req.headers["authorization"];

   console.log("Token Received:", token);

   if (!token) {
       res.status(401).json({ message: "Authentication Required: No token provided" });
       return;
   }

   try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
       if (typeof decoded === 'string') {
          res.status(401).json({ message: "Unauthorized: Invalid token structure" });
          return;
         }
         req.user = decoded;
         console.log("Verified Successfully:", decoded);
       next();
   } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid Token" });
        return;
   }
};

const roleMiddleware = (req:AuthenticateRequest,res:Response,next:NextFunction) :void=>{
      const user = req.user as JwtPayload;
      if(!user || !["Admin"].includes(user.role)){
         res.status(401).json({message:"Forbidden:Access Denied"});
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

export {roleMiddleware,verifyToken};