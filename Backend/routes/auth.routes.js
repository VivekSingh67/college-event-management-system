const express = require('express');
const routes = express.Router()
const studentController = require('../controllers/auth.controller')


routes.post('/registerStudent', studentController.registerStudent)
routes.post('/loginStudent', studentController.loginStudent)

module.exports = routes;