import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { Request,Response,NextFunction } from 'express';
import { Parser } from 'json2csv';
import dotenv from 'dotenv';
dotenv.config();

import { readCsvFile } from '../service/readcsv';
import db from '../models/index';
const { staff,student} = db;

export const staffLogin = async function(req:Request,res:Response):Promise<void>{
   try{
     const {staffName,password} = req.body;
     const data = await staff.findOne({where:{staffName}});
     // console.log(data);
     // const role = data.
     if(!data){
       res.status(400).json({message:"No Staff found with the name"});
       return
     }
     if(password != data.password){
       res.status(400).json({message:"Invalid Password"});
       return 
     }
     const token = jwt.sign({staffName:data.staffName,password:data.password,role:data.role},process.env.JWT_SECRET as string,{expiresIn:'1h'});
    //  console.log(token);
     res.status(200).json({message:"Logged In Successfully",token});
   }
   catch(error){
     console.log(error);
     res.status(500).json({error});
   }
};

export const getStaff = async function(req:Request, res:Response, next:NextFunction):Promise<void> {
   try{
     const data = await staff.findAll();
     if(data.length == 0){
       res.status(200).json({message:"No Staff Found.."});
       return;
     }
     res.status(200).json(data);
   }catch(error){
     console.log(error);
     res.status(500).json({error});
   }
};

export const getStaffById = async(req:Request,res:Response):Promise<void>=>{
   try{
     const {id} = req.params;
     const data = await staff.findByPk(id);
     if(!data){
       res.status(404).json({message:"No Staff found with the Id"});
       return; 
     }
     res.status(200).json(data);
   }
   catch(error){
     console.log(error);
     res.status(500).json({error});
   }
};

export const createStaff = async function(req:Request,res:Response):Promise<void>{
   try{
     const {staffName,role,experience,password} = req.body;
     if(!staffName || !experience || !role|| !password){
       res.status(400).json({message:"All Fields Required"});
       return 
     }
     await staff.create({staffName,role,experience,password});
     res.status(201).json({message:"Staff Added Successfully"});
   }
   catch(error){
     console.log(error);
     res.status(500).json({error});
   }
};

export const updateStaff = async(req:Request,res:Response) => {
   try{
     const {id} = req.params;
     const {staffName,role,experience,password} = req.body;
 
     // if(!staffName || !role || !experience){
     //   return res.status(400).json({message:"All fields are required"});
     // }
 
     const checkexistdata = await staff.findByPk(id);
     console.log(checkexistdata);
     if(!checkexistdata){
       res.status(404).json({message:"Not Staff found with the id"});
       return 
     }
     const dt = await staff.update({staffName,role,experience,password},{where:{id}});
     if(dt[0] === 1){
       res.status(200).json({ message: "Staff updated successfully" });
       return 
     }
     res.status(400).json({ message: "No changes made"});
     
   }catch(error){
     console.log(error);
     res.status(500).json({error});
   }
};

export const deleteStaff = async(req:Request,res:Response)=>{
   try{
     const {id} = req.params;
     const result = await staff.findByPk(id);
     if(!result){
       res.status(404).json({message:"No Staff found with the Id"});
       return 
        
     }
     await result.destroy();
     res.status(200).json({message:"Staff Deleted Successfully"});
   }
   catch(error){
     console.log(error);
     res.status(500).json({error});
   }
};

export const getStudents = async(req:Request,res:Response):Promise<void>=>{
   try{
     const {id} = req.params;
     const result = await staff.findByPk(id,{
       include:{
         model:student,
         attributes:['studentName','age','marks']
       },
       attributes:{
         exclude:['password']
       }
     });
     if(!result){
       res.status(404).json({message:"No Students Found for Staff"});
       return 
     }
     res.status(200).json(result);
   }
   catch(error){
     console.log(error);
     res.status(500).json({error});
   }
};

export const getcsv = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
   if(!req.file){
     res.status(404).json({error:"No CSV file uploaded"});
     return 
   }
   console.log(__dirname);
   const filePath = path.join(__dirname,'../../uploads',req.file.filename);
   try{
     const csvData = await readCsvFile(filePath);
     req.body.data = csvData;
     console.log(csvData);
     next();
     // res.status(200).json({message:"CSV file proocessed successfully",data:csvData});
   }
   catch(error){
     console.log("Error in Reading the csv file");
     // return res.status(500).json({error:"Error processing csv file "});
     next(error);
   }
};

export const bulkInsertFromcsv =
async(req:Request,res:Response,next:NextFunction):Promise<void> => {
   try{
     const staffData = req.body.data;
     // const InsertData = staffData.map(row =>)
     const insertStaff = await staff.bulkCreate(staffData);
     res.status(201).json({message:"Staffs record Inserted..."});
   }
   catch(error){
     console.log("Error Occured ",error);
     res.status(500).json({message:"Errror Occured ",error});
   }
};

export const exportStaffData = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
   try{
      const data = await staff.findAll({raw:true});
      const fields = ['id','staffName','role','experience','password'];
      const parser = new Parser({fields});
      const csv = parser.parse(data);

      const filepath = path.join(__dirname,'../../exports/staffs.csv')
      fs.writeFileSync(filepath,csv);

      res.download(filepath, 'staffs.csv');
   }
   catch(error){
      console.log(error);
      res.status(500).json({message:"Error Occured ",error});
   }
}