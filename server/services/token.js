const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    id: user._id, // Assuming your user object has an '_id' property
  };

  const options = {
    expiresIn: "1h", // Set the expiration time for the token
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = generateToken;
