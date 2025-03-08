import app from "./app.js";
import http from "http"; // Import http module

import dotenv from "dotenv";
import connectDatabase from "./db/db.js";

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "./backend/config/.env",
  });
}

// Handle Uncaught error Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server for handling unchaught error >>>");
});

// Database Connect
connectDatabase();

// Server Start
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on Http://localhost:${process.env.PORT}`);
});

// Unhandled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Unhandled Rejection, shutting down the server >>>");

  server.close(() => {
    process.exit(1);
  });
});
