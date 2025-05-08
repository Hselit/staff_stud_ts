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
exports.gethtmlfile = exports.readhtmlFile = exports.fileToPdf = exports.AddEmailTemplate = void 0;
const fs_1 = __importDefault(require("fs"));
const html_pdf_1 = __importDefault(require("html-pdf"));
const util_1 = require("util");
const index_1 = __importDefault(require("../models/index"));
const sendMail_1 = __importDefault(require("../service/sendMail"));
const path_1 = __importDefault(require("path"));
const { Email, Html } = index_1.default;
const createPdf = (0, util_1.promisify)(html_pdf_1.default.create);
console.log("createpdf " + createPdf);
const AddEmailTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { type, from, to } = data;
    try {
        const mailoption = yield Email.findOne({ where: { type: type } });
        console.log(mailoption);
        if (!mailoption) {
            res.status(404).json({ message: "No Mail Template found with this type" });
            return;
        }
        sendMail_1.default.sendMail(Object.assign(Object.assign({}, mailoption.dataValues), { from, to }), (error, info) => {
            if (error) {
                res.status(500).json({ message: "Error in Sending Mail" });
            }
            else {
                res.status(200).json({ message: "Mail Sent Success", info });
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
});
exports.AddEmailTemplate = AddEmailTemplate;
const fileToPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const file = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || "";
        const filepath = path_1.default.join(process.cwd(), "uploads", file); // use process.cwd()
        console.log(filepath);
        const html = fs_1.default.readFileSync(filepath, "utf8");
        const options = { format: "A4" };
        html_pdf_1.default.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Failed to create PDF" });
                return;
            }
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=converted.pdf",
                "Content-Length": buffer.length,
            });
            res.send(buffer);
        });
    }
    catch (error) {
        console.error("Error reading file:", error);
        res.status(500).json({ message: "Error reading uploaded file" });
    }
});
exports.fileToPdf = fileToPdf;
const readhtmlFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const file = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || "";
        const filepath = path_1.default.join(process.cwd(), "uploads", file); // use process.cwd()
        console.log(filepath);
        const html = fs_1.default.readFileSync(filepath, "utf8");
        console.log("HTML Content:", html);
        res.status(200).json({ message: "File read successfully" });
    }
    catch (error) {
        console.error("Error reading file:", error);
        res.status(500).json({ message: "Error reading uploaded file" });
    }
});
exports.readhtmlFile = readhtmlFile;
const gethtmlfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.body;
        const htmlcontent = yield Html.findOne({ where: { type: type } });
        const htmlc = htmlcontent === null || htmlcontent === void 0 ? void 0 : htmlcontent.dataValues.content;
        console.log(htmlc);
        const options = { format: "A4" };
        if (!htmlc) {
            res.status(500).json({ message: "No html content found with this type" });
            return;
        }
        html_pdf_1.default.create(htmlc, options).toBuffer((err, buffer) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Failed to create PDF" });
                return;
            }
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=converted.pdf",
                "Content-Length": buffer.length,
            });
            res.send(buffer);
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error Occured ", err });
    }
});
exports.gethtmlfile = gethtmlfile;
