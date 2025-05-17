import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJsDocs from "swagger-jsdoc";

import indexRouter from "./routes/index";
import staffRouter from "./routes/staff";
import studentRoutes from "./routes/student";
import emailRoutes from "./routes/email";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const options: swaggerJsDocs.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Staff Student Management",
      version: "1.0.0",
      description: "A Simple Staff Student Management APIs",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsDocs(options);
app.use("/api", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/", indexRouter);
app.use("/staff", staffRouter);
app.use("/student", studentRoutes);
app.use("/email", emailRoutes);

export default app;
