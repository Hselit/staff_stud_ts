"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.roleMiddleware = void 0;
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    console.log("Token Received:", token);
    if (!token) {
        res.status(401).json({ message: "Authentication Required: No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'string') {
            res.status(401).json({ message: "Unauthorized: Invalid token structure" });
            return;
        }
        req.user = decoded;
        console.log("Verified Successfully:", decoded);
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid Token" });
        return;
    }
};
exports.verifyToken = verifyToken;
const roleMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user || !["Admin"].includes(user.role)) {
        res.status(401).json({ message: "Forbidden:Access Denied" });
        return;
    }
    next();
};
exports.roleMiddleware = roleMiddleware;
