const express = require('express')
const routes = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const batchController = require('../controllers/batch.controller')

routes.post('/create', authMiddleware.authUserMiddleware, batchController.createBatch)

module.exports = routes