const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  console.log("Generating Token for ID:", id); // Logs token generation for debugging
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '1hr' });
};

module.exports = generateToken;
