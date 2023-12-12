const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const roomController = require("./../controllers/roomController");

// Middleware to check if the user is authenticated
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Attach the user object to the request for later use
    req.user = user;
    console.log("token is authorized!!");
    next();
  });
};

/**
 * @method GET
 * @access private
 * @endpoint /api/users/login
 */
router.get("/get-all", authenticateToken, roomController.getAllRooms);

module.exports = router;
