"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    console.log("Token Received:", token);
    if (!token) {
        return res.status(401).json({ message: "Authentication Required: No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'string') {
            return res.status(401).json({ message: "Unauthorized: Invalid token structure" });
        }
        req.user = decoded;
        console.log("Verified Successfully:", decoded);
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }
};
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(401).json({ message: "Forbidden:Access Denied" });
        }
        next();
    };
};
module.exports = { roleMiddleware, verifyToken };
