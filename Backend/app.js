const express = require("express");
const app = express();
const path = require("path");
const db = require("./config/db")
db()
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth.routes")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(cookieParser());

app.use("/auth", authRouter)

module.exports = app;
