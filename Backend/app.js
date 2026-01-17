require('dotenv').config()
const express = require("express")
const app = express()
const db = require("./db/db")
db()
const cookiesParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookiesParser())

app.use('/api/auth', authRoutes)

module.exports = app;