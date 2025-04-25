"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
require('dotenv').config();
const { validateStudentUpdate, validateStudentCreate, validateStudentId, validateStudentLogin } = require('../middleware/studentValidator');
const { verifyToken, roleMiddleware } = require('../middleware/auth');
var db = require('../models/index');
const imageUpload_1 = __importDefault(require("../middleware/imageUpload"));
var { staff, student } = db;
router.post('/studentlogin', validateStudentLogin, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { studentName, password } = req.body;
            const data = yield student.findOne({ where: { studentName } });
            if (!data) {
                return res.status(400).json({ message: "No Student found with the name" });
            }
            if (password != data.password) {
                return res.status(400).json({ message: "Invalid Password" });
            }
            const role = "student";
            const token = jwt.sign({ studentName, password, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Logged In Successfully", token });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
});
//get student method
router.get('/', verifyToken, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield student.findAll();
            if (data.length == 0) {
                return res.status(200).json({ message: "No student Found.." });
            }
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
});
//get single student method
router.get('/:id', verifyToken, roleMiddleware(["Admin"]), validateStudentId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield student.findByPk(id);
        console.log(data);
        if (!data) {
            return res.status(404).json({ message: "No student found with the Id" });
        }
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}));
//student post method
router.post('/', verifyToken, roleMiddleware(["Admin"]), imageUpload_1.default.single('profile'), validateStudentCreate, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { studentName, password, marks, age, staff_id } = req.body;
            const profile = req.file ? req.file.filename : null;
            // if(!staffName || !experience || !role){
            //   return res.status(400).json({message:"All Fields Required"});
            // }
            yield student.create({ studentName, password, age, marks, staff_id, profile });
            res.status(201).json({ message: "student Added Successfully" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
});
//student update method
router.put('/:id', verifyToken, roleMiddleware(["Admin"]), imageUpload_1.default.single('profile'), validateStudentUpdate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { studentName, marks, age, staff_id, password } = req.body;
        const image = req.file ? req.file.filename : null;
        // if(!studentName || !marks || !age ||!staff_id){
        //   return res.status(400).json({message:"All fields are required"});
        // }
        const checkexistdata = yield student.findByPk(id);
        console.log(checkexistdata);
        if (!checkexistdata) {
            return res.status(404).json({ message: "Not student found with the id" });
        }
        const updateData = { studentName, marks, age, staff_id, password };
        if (image)
            updateData.profile = image;
        const dt = yield student.update(updateData, { where: { id } });
        if (dt[0] === 1) {
            return res.status(200).json({ message: "student updated successfully" });
        }
        return res.status(400).json({ message: "No changes made" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}));
//staff delete method
router.delete('/:id', verifyToken, roleMiddleware(["Admin"]), validateStudentId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield student.findByPk(id);
        if (!result) {
            return res.status(404).json({ message: "No student found with the Id" });
        }
        yield result.destroy();
        res.status(200).json({ message: "student Deleted Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}));
//get student with staff
router.get('/getstaff/:id', verifyToken, roleMiddleware(["Admin"]), validateStudentId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield staff.findByPk(id, {
            include: {
                model: student,
                attribute: {
                    exclude: ['password']
                }
            },
            attribute: {
                exclude: ['password']
            }
        });
        if (!result) {
            return res.status(404).json({ message: "No Staff Found" });
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}));
module.exports = router;
