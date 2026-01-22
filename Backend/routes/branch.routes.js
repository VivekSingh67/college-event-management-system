const express = require('express')
const routes = express.Router()
const branchController = require("../controllers/branch.controller")
const authMiddleware = require('../middlewares/auth.middleware')

routes.post('/create-branch',authMiddleware.authUserMiddleware, branchController.createBranch)


module.exports = routes