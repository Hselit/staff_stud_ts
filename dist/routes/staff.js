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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { validateStaffId, validateStaffCreate, validateStaffUpdate, validateStaffLogin } = require('../middleware/staffValidator');
const { verifyToken, roleMiddleware } = require('../middleware/auth');
var db = require('../models/index');
var { staff, student } = db;
//staff login
router.post('/stafflogin', validateStaffLogin, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { staffName, password, role } = req.body;
            const data = yield staff.findOne({ where: { staffName } });
            if (!data) {
                return res.status(400).json({ message: "No Staff found with the name" });
            }
            if (password != data.password) {
                return res.status(400).json({ message: "Invalid Password" });
            }
            const token = jwt.sign({ staffName, password, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log(token);
            res.status(200).json({ message: "Logged In Successfully", token });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
});
//get staff method
router.get('/', verifyToken, roleMiddleware(["Admin"]), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield staff.findAll();
            if (data.length == 0) {
                return res.status(200).json({ message: "No Staff Found.." });
            }
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
});
//get single staff method
router.get('/:id', verifyToken, roleMiddleware(["Admin"]), validateStaffId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield staff.findByPk(id);
        if (!data) {
            return res.status(404).json({ message: "No Staff found with the Id" });
        }
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}));
//staff post method
router.post('/', validateStaffCreate, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { staffName, role, experience, password } = req.body;
            if (!staffName || !experience || !role || !password) {
                return res.status(400).json({ message: "All Fields Required" });
            }
            yield staff.create({ staffName, role, experience, password });
            res.status(201).json({ message: "Staff Added Successfully" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
});
//staff update method
router.put('/:id', verifyToken, roleMiddleware(["Admin"]), validateStaffUpdate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { staffName, role, experience, password } = req.body;
        // if(!staffName || !role || !experience){
        //   return res.status(400).json({message:"All fields are required"});
        // }
        const checkexistdata = yield staff.findByPk(id);
        console.log(checkexistdata);
        if (!checkexistdata) {
            return res.status(404).json({ message: "Not Staff found with the id" });
        }
        const dt = yield staff.update({ staffName, role, experience, password }, { where: { id } });
        if (dt[0] === 1) {
            return res.status(200).json({ message: "Staff updated successfully" });
        }
        res.status(400).json({ message: "No changes made" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}));
//staff delete method
router.delete('/:id', verifyToken, roleMiddleware(["Admin"]), validateStaffId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield staff.findByPk(id);
        if (!result) {
            return res.status(404).json({ message: "No Staff found with the Id" });
        }
        yield result.destroy();
        res.status(200).json({ message: "Staff Deleted Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}));
//get staffs with students
router.get('/getallstudent/:id', verifyToken, roleMiddleware(["Admin"]), validateStaffId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield staff.findByPk(id, {
            include: {
                model: student,
                attributes: ['studentName', 'age', 'marks']
            },
            attributes: {
                exclude: ['password']
            }
        });
        if (!result) {
            return res.status(404).json({ message: "No Students Found for Staff" });
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}));
module.exports = router;
