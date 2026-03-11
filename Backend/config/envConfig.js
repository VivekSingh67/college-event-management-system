const dotenv = require("dotenv");
dotenv.config();

const envConfig = {
  PORT: process.env.PORT || 3000,

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,

  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  NODE_ENV: process.env.NODE_ENV || "development",

  BASE_URL: process.env.BASE_URL,
};

module.exports = envConfig;
