import express from "express";
import dotenv from "dotenv";
import errorHandler from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import user from "./controller/user_controller.js";

// import fileUpload from "express-fileupload";

const app = express();



app.use("/", express.static("uploads"))
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true})); 
// app.use(fileUpload({useTempFiles: true}))

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "./backend/config/.env",
  });
}

app.use("/api/v2/user",user);

// For Error Handling
app.use(errorHandler); 
export default app;
