const express = require('express');
const routes = express.Router()
const authController = require('../controllers/auth.controller') 


routes.post("/register", authController.authRegister)
routes.post("/login", authController.authLogin)


module.exports = routes;