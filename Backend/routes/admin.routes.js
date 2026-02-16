const express = require("express");
const routes = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");

routes.post("/create", authMiddleware.authUserMiddleware, adminController.createAdmin)
routes.get("/getData", authMiddleware.authUserMiddleware, adminController.getData)
routes.get("/getDataById/:id", authMiddleware.authUserMiddleware, adminController.getDataById)
routes.put("/update/:id", authMiddleware.authUserMiddleware, adminController.updateData)

module.exports = routes;
