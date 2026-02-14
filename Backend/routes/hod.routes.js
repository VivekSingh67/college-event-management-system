const express = require('express')
const routes = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const hodController = require("../controllers/hod.controller")

routes.post('/create', authMiddleware.authUserMiddleware, hodController.createHod)
routes.get('/getData', authMiddleware.authUserMiddleware, hodController.getData)
routes.put('/update/:id', authMiddleware.authUserMiddleware, hodController.updateData)

module.exports = routes