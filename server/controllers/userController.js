const User = require("../models/user");

const getUserInfo = async (req, res) => {
  try {
    console.log(req);
    const user = await User.findById(req.user.id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUserInfo,
};
