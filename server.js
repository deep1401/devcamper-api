const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect DB
connectDB();

// Load routes
const bootcamps = require("./routes/bootcamps");

const app = express();

//Use Morgan for debugging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Set routes for the server
app.use("/bootcamps/api/v1", bootcamps);

// Set Port
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//Handled Unhandled Promise Rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
