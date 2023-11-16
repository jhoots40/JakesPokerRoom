const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const userController = require("./../controllers/userController");

/**
 * @method POST
 * @access public
 * @endpoint /api/users/register
 */
router.post("/register", userController.registerUser);

/**
 * @method POST
 * @access public
 * @endpoint /api/users/login
 */
router.post("/login", userController.loginUser);

module.exports = router;
