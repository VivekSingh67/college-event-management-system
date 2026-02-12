const express = require('express')
const routes = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const batchController = require('../controllers/batch.controller')

routes.post('/create', authMiddleware.authUserMiddleware, batchController.createBatch)
routes.get('/getData', authMiddleware.authUserMiddleware, batchController.getData)
routes.put('/update/:id', authMiddleware.authUserMiddleware, batchController.updateBatch)
routes.delete('/delete/:id', authMiddleware.authUserMiddleware, batchController.deleteBatch)

module.exports = routes