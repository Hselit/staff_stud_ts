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
exports.exportStaffData = exports.bulkInsertFromcsv = exports.getcsv = exports.getStudents = exports.deleteStaff = exports.updateStaff = exports.createStaff = exports.getStaffById = exports.getStaff = exports.staffLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const json2csv_1 = require("json2csv");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const readcsv_1 = require("../service/readcsv");
const index_1 = __importDefault(require("../models/index"));
const { staff, student } = index_1.default;
const staffLogin = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { staffName, password } = req.body;
            const data = yield staff.findOne({ where: { staffName } });
            // console.log(data);
            // const role = data.
            if (!data) {
                res.status(400).json({ message: "No Staff found with the name" });
                return;
            }
            if (password != data.password) {
                res.status(400).json({ message: "Invalid Password" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ staffName: data.staffName, password: data.password, role: data.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            //  console.log(token);
            res.status(200).json({ message: "Logged In Successfully", token });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
};
exports.staffLogin = staffLogin;
const getStaff = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield staff.findAll();
            if (data.length == 0) {
                res.status(200).json({ message: "No Staff Found.." });
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
exports.getStaff = getStaff;
const getStaffById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield staff.findByPk(id);
        if (!data) {
            res.status(404).json({ message: "No Staff found with the Id" });
            return;
        }
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.getStaffById = getStaffById;
const createStaff = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { staffName, role, experience, password } = req.body;
            if (!staffName || !experience || !role || !password) {
                res.status(400).json({ message: "All Fields Required" });
                return;
            }
            yield staff.create({ staffName, role, experience, password });
            res.status(201).json({ message: "Staff Added Successfully" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
};
exports.createStaff = createStaff;
const updateStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { staffName, role, experience, password } = req.body;
        // if(!staffName || !role || !experience){
        //   return res.status(400).json({message:"All fields are required"});
        // }
        const checkexistdata = yield staff.findByPk(id);
        console.log(checkexistdata);
        if (!checkexistdata) {
            res.status(404).json({ message: "Not Staff found with the id" });
            return;
        }
        const dt = yield staff.update({ staffName, role, experience, password }, { where: { id } });
        if (dt[0] === 1) {
            res.status(200).json({ message: "Staff updated successfully" });
            return;
        }
        res.status(400).json({ message: "No changes made" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.updateStaff = updateStaff;
const deleteStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield staff.findByPk(id);
        if (!result) {
            res.status(404).json({ message: "No Staff found with the Id" });
            return;
        }
        yield result.destroy();
        res.status(200).json({ message: "Staff Deleted Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.deleteStaff = deleteStaff;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.status(404).json({ message: "No Students Found for Staff" });
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.getStudents = getStudents;
const getcsv = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(404).json({ error: "No CSV file uploaded" });
        return;
    }
    console.log(__dirname);
    const filePath = path_1.default.join(__dirname, '../../uploads', req.file.filename);
    try {
        const csvData = yield (0, readcsv_1.readCsvFile)(filePath);
        req.body.data = csvData;
        console.log(csvData);
        next();
        // res.status(200).json({message:"CSV file proocessed successfully",data:csvData});
    }
    catch (error) {
        console.log("Error in Reading the csv file");
        // return res.status(500).json({error:"Error processing csv file "});
        next(error);
    }
});
exports.getcsv = getcsv;
const bulkInsertFromcsv = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffData = req.body.data;
        // const InsertData = staffData.map(row =>)
        const insertStaff = yield staff.bulkCreate(staffData);
        res.status(201).json({ message: "Staffs record Inserted..." });
    }
    catch (error) {
        console.log("Error Occured ", error);
        res.status(500).json({ message: "Errror Occured ", error });
    }
});
exports.bulkInsertFromcsv = bulkInsertFromcsv;
const exportStaffData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield staff.findAll({ raw: true });
        const fields = ['id', 'staffName', 'role', 'experience', 'password'];
        const parser = new json2csv_1.Parser({ fields });
        const csv = parser.parse(data);
        const filepath = path_1.default.join(__dirname, '../../exports/staffs.csv');
        fs_1.default.writeFileSync(filepath, csv);
        res.download(filepath, 'staffs.csv');
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Occured ", error });
    }
});
exports.exportStaffData = exportStaffData;
