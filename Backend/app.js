require('dotenv').config()
const express = require("express")
const app = express()
const db = require("./db/db")
db()
const cookiesParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const branchRoutes = require('./routes/branch.routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookiesParser())

app.use('/auth', authRoutes)
app.use('/api', branchRoutes)

module.exports = app;