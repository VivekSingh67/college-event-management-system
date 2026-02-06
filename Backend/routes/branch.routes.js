const express = require('express')
const routes = express.Router()
const branchController = require("../controllers/branch.controller")
const authMiddleware = require('../middlewares/auth.middleware')

routes.post('/create',authMiddleware.authUserMiddleware, branchController.createBranch)
routes.get('/get-data',authMiddleware.authUserMiddleware, branchController.getBranchData)
routes.put('/update/:id',authMiddleware.authUserMiddleware, branchController.updateBranch)
routes.delete('/delete/:id',authMiddleware.authUserMiddleware, branchController.deleteBranch)


module.exports = routes