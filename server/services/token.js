const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    id: user._id, // Assuming your user object has an '_id' property
    // Exclude some standard claims if you don't want them
    // iss: 'issuer',
    // exp: Math.floor(Date.now() / 1000) + (60 * 60), // expiration time in 1 hour
    // nbf: Math.floor(Date.now() / 1000), // not before
    // iat: Math.floor(Date.now() / 1000), // issued at
    // sub: 'subject',
  };

  const options = {
    expiresIn: "1h", // Set the expiration time for the token
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = generateToken;
