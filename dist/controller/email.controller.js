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
exports.AddEmailTemplate = void 0;
const index_1 = __importDefault(require("../models/index"));
const sendMail_1 = __importDefault(require("../service/sendMail"));
const { Email } = index_1.default;
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
