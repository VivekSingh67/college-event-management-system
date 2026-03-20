const express = require("express");
const router = express.Router();
const controllers = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validate.middleware");

// POST /auth/register  — public, with validation
router.post("/register", validate("register"), controllers.register);

// POST /auth/login     — public, with validation
router.post("/login", validate("login"), controllers.login);

// POST /auth/logout    — public (clears cookie)
router.post("/logout", controllers.logout);

module.exports = router;
