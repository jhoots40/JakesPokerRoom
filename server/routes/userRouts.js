const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");

/**
 * @method POST
 * @access public
 * @endpoint /api/v1/signup
 */
router.post("/signup", async (req, res) => {
  const jsonData = req.body;

  if (
    req.body.firstName === undefined ||
    req.body.lastName === undefined ||
    req.body.email === undefined
  ) {
    res.status(400).json({ error: "Request body is missing or empty" });
    return;
  }

  const result = await User.findOne({ email: jsonData.email });

  if (result === null) {
    console.log(jsonData.email);
    const newUser = new User({
      firstName: jsonData.firstName,
      lastName: jsonData.lastName,
      email: jsonData.email,
    });
    newUser.save();
    res.json({
      message: "added user successfully to the database",
    });
  } else {
    res.json({
      message: "you cannot add a duplicate user",
    });
  }
});

/**
 * @method POST
 * @access public
 * @endpoint /api/v1/post
 **/
router.post("/post", (req, res) => {
  const user = new User({ firstName: "Jacob", lastName: "Houts" });
  user.save();
  res.json({
    message: `Added User ${user.firstName} ${user.lastName}`,
  });
});

router.get("/getJake", async (req, res) => {
  const result = await User.find();
  res.send(result);
});

/**
 * @method GET
 * @access public
 * @endpoint /api/v1/get
 **/
router.get("/get", (req, res) => {
  res.json({
    message: "GET API for MERN Boilerplate",
    APIs: "Other Endpoints",
    create: "/api/v1/post",
    read: "/api/v1/get",
    update: "/api/v1/put/<ID>",
    delete: "/api/v1/delete/<ID>",
  });
});

/**
 * @method PUT
 * @access public
 * @endpoint /api/v1/put/32323
 **/
router.put("/put/:id", (req, res) => {
  res.json({
    message: `PUT ${req.params.id} API for MERN Boilerplate`,
  });
});

/**
 * @method DELETE
 * @access public
 * @endpoint /api/v1/delete/424
 **/
router.delete("/delete/:id", (req, res) => {
  res.json({
    message: `DELETE ${req.params.id} API for MERN Boilerplate`,
  });
});

module.exports = router;
