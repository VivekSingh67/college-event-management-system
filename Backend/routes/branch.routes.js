const express = require('express')
const routes = express.Router()
const branchController = require("../controllers/branch.controller")
const authMiddleware = require('../middlewares/auth.middleware')

routes.post('/create-branch',authMiddleware.authUserMiddleware, branchController.createBranch)
routes.get('/get-branch-data',authMiddleware.authUserMiddleware, branchController.getBranchData)
routes.put('/update-branch/:id',authMiddleware.authUserMiddleware, branchController.updateBranch)
routes.delete('/delete-branch/:id',authMiddleware.authUserMiddleware, branchController.deleteBranch)


module.exports = routes