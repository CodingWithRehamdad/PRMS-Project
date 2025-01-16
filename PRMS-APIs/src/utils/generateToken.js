const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

module.exports = generateToken;
