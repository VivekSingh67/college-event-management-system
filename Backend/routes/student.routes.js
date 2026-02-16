const express = require('express')
const routes = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const studentController = require("../controllers/student.controller")

routes.get("/get-data", authMiddleware.authUserMiddleware , studentController.getData)
routes.get("/get-data/:id", authMiddleware.authUserMiddleware , studentController.getDataById)

module.exports = routes