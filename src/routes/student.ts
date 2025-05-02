const express = require('express');
const router = express.Router();

import { validateStudentUpdate, validateStudentCreate, validateStudentId, validateStudentLogin } from '../middleware/studentValidator';
import {verifyToken,roleMiddleware} from '../middleware/auth';
import { getStudent, getStudentById, updateStudent, deleteStudent, getStaffs, createStudent, studentLogin, exportStudentData } from '../controller/student.controller';
import upload from '../middleware/imageUpload';

// Student Login
router.post('/studentlogin',validateStudentLogin,studentLogin);

//get student method
router.get('/',verifyToken,getStudent);

//export data using csv
router.get('/export',verifyToken,roleMiddleware,exportStudentData);

//get single student method
router.get('/:id',verifyToken,roleMiddleware,validateStudentId,getStudentById);

//student post method
router.post('/',verifyToken,roleMiddleware,upload.single('profile'),validateStudentCreate,createStudent);

//student update method
router.put('/:id',verifyToken,roleMiddleware,upload.single('profile'),validateStudentUpdate,updateStudent);

//staff delete method
router.delete('/:id',verifyToken,roleMiddleware,validateStudentId,deleteStudent);

//get student with staff
router.get('/getstaff/:id',verifyToken,roleMiddleware,validateStudentId,getStaffs);

export default router;