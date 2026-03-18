const express = require("express");
const app = express();
const path = require("path");
const db = require("./config/db")
db()
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth.routes")
const collegeRoutes = require("./routes/college.routes")
const branchRoutes = require("./routes/branch.routes")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(cookieParser());

app.use("/auth", authRouter)
app.use("/api/colleges", collegeRoutes);
app.use("/api/branch", branchRoutes);

module.exports = app;
