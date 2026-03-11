const mongoose = require("mongoose");
const envConfig = require("./envConfig");

const connectDB = () => {
  mongoose
    .connect(envConfig.MONGO_URI)
    .then(() => {
      console.log(`MongoDB Connected`);
    })
    .catch((error) => {
      console.error("Database connection error:", error.message);
    });
};

module.exports = connectDB;
