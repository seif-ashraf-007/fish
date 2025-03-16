process.on("uncaughtException", (err) => {
  console.log("Error in Code", err);
});
import express from "express";
import { globalError } from "./src/MiddleWares/globalError.js";
import { AppError } from "./src/utils/appError.js";
import dotenv from "dotenv";
import { DBConnect } from "./DB/db.connection.js";
import { bootstrap } from "./src/Bootstrap.js";
import cors from "cors";
dotenv.config();
const app = express();
const port = 3000;

// Apply CORS middleware BEFORE any other middleware or routes
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Specifically allow your live server origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials
  })
);

app.use(express.json());
bootstrap(app);

app.use("*", (req, res, next) => {
  next(new AppError(`Route Not Found ${req.originalUrl}`, 404));
});

app.use(globalError);
process.on("unhandledRejection", (err) => {
  console.log("Error", err);
});

app.listen(port, () => {
  console.log("Server is running..");
});
