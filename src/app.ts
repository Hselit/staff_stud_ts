import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";
import staffRouter from "./routes/staff";
import studentRoutes from "./routes/student";
import emailRoutes from "./routes/email";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);
app.use("/staff", staffRouter);
app.use("/student", studentRoutes);
app.use("/email", emailRoutes);

export default app;
