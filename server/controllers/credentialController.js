const User = require("../models/user");
const generateToken = require("../services/token");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
      password,
    });

    const savedUser = await newUser.save();

    res.cookie("username", username, { maxAge: 900000, httpOnly: true });

    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      res.status(400).json({ error: "Email is already in use" });
    } else if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.username
    ) {
      res.status(400).json({ error: "Username is already taken" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = user.password === password;

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, { httpOnly: true });

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserInfo = async (req, res) => {};

module.exports = {
  registerUser,
  loginUser,
  // ... (Other controller functions)
};
