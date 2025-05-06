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
exports.exportStudentData = exports.getStaffs = exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudentById = exports.studentLogin = exports.getStudent = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const json2csv_1 = require("json2csv");
const index_1 = __importDefault(require("../models/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { Staff, Student } = index_1.default;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getStudent = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield Student.findAll();
            if (data.length == 0) {
                res.status(200).json({ message: "No student Found.." });
                return;
            }
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
};
exports.getStudent = getStudent;
const studentLogin = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { studentName, password } = req.body;
            const data = yield Student.findOne({ where: { studentName } });
            if (!data) {
                res.status(400).json({ message: "No Student found with the name" });
                return;
            }
            if (password != data.password) {
                res.status(400).json({ message: "Invalid Password" });
                return;
            }
            const role = "student";
            console.log({ studentName: data.studentName, password: data.password, role: role });
            const token = jsonwebtoken_1.default.sign({ studentName: data.studentName, password: data.password, role: role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ message: "Logged In Successfully", token });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
};
exports.studentLogin = studentLogin;
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield Student.findByPk(id);
        console.log(data);
        if (!data) {
            res.status(404).json({ message: "No student found with the Id" });
            return;
        }
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.getStudentById = getStudentById;
const createStudent = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { studentName, password, marks, age, staff_id } = req.body;
            const profile = req.file ? req.file.filename : null;
            // if(!staffName || !experience || !role){
            //   return res.status(400).json({message:"All Fields Required"});
            // }
            yield Student.create({ studentName, password, age, marks, staff_id, profile });
            res.status(201).json({ message: "student Added Successfully" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
};
exports.createStudent = createStudent;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { studentName, marks, age, staff_id, password } = req.body;
        const image = req.file ? (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename : null;
        // console.log("req.file ",req.body.file)
        // console.log("image ",image);
        // console.log("student Name ",studentName,"Age ",age,"marks ",marks,"pass ",password);
        // if(!studentName || !marks || !age ||!staff_id){
        //   return res.status(400).json({message:"All fields are required"});
        // }
        const checkexistdata = yield Student.findByPk(id);
        // console.log(checkexistdata);
        if (!checkexistdata) {
            res.status(404).json({ message: "Not student found with the id" });
            return;
        }
        // console.log("req.file:", req.file);
        // console.log("Image filename:", image);
        const updateData = { studentName, marks, age, staff_id, password };
        if (image) {
            // console.log("inside image");
            updateData.profile = image;
        }
        // console.log("Update Data:", updateData);
        const dt = yield Student.update(updateData, { where: { id } });
        // console.log(dt);
        if (dt[0] === 1) {
            res.status(200).json({ message: "student updated successfully" });
            return;
        }
        res.status(400).json({ message: "No changes made" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield Student.findByPk(id);
        if (!result) {
            res.status(404).json({ message: "No student found with the Id" });
            return;
        }
        yield result.destroy();
        res.status(200).json({ message: "student Deleted Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.deleteStudent = deleteStudent;
const getStaffs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield Staff.findByPk(id, {
            include: {
                model: Student,
                attributes: {
                    exclude: ["password"],
                },
            },
            attributes: {
                exclude: ["password"],
            },
        });
        if (!result) {
            res.status(404).json({ message: "No Staff Found" });
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.getStaffs = getStaffs;
const exportStudentData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Student.findAll({ raw: true });
        const fields = ["id", "studentName", "marks", "age", "password", "profile", "staff_id"];
        const parser = new json2csv_1.Parser({ fields });
        const csv = parser.parse(data);
        const filepath = path_1.default.join(__dirname, "../../exports/students.csv");
        fs_1.default.writeFileSync(filepath, csv);
        res.download(filepath, "students.csv");
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Occured ", error });
    }
});
exports.exportStudentData = exportStudentData;
