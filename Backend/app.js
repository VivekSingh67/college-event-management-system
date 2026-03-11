const express = require("express");
const app = express();
const path = require("path");
const db = require("./config/db")
db()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

module.exports = app;
