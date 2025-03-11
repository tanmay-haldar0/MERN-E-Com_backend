import express from "express";
import dotenv from "dotenv";
import errorHandler from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import user from "./controller/user_controller.js";
import cors from "cors"

// import fileUpload from "express-fileupload";

const app = express();
 


app.use("/", express.static("uploads"))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(fileUpload({useTempFiles: true}))

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "./backend/config/.env",
  });
}

app.use("/api/v2/user",user);

// For Error Handling
app.use((err, req, res, next) => {
  const handler = new errorHandler(err.message, err.statusCode);
  // Handle the error response here
});

export default app; 
