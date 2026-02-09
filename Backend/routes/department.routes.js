const express = require('express')
const routes = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const departmentController = require('../controllers/department.controller')


routes.post('/create', authMiddleware.authUserMiddleware, departmentController.createDepartment)
routes.get('/getData/:branchId', authMiddleware.authUserMiddleware, departmentController.getDepartmentData)
routes.put('/update/:id', authMiddleware.authUserMiddleware, departmentController.updateDepartment)
routes.delete('/delete/:id', authMiddleware.authUserMiddleware, departmentController.deleteDepartment)

module.exports = routes