const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsyncErrors = require('./catchAsyncError')


//-----------------Middleware to protect routes--------------------

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'No token provided or invalid token format' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); 
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

//---------- Middleware to check roles--------------

const roleMiddleware = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient persmission' })
  }
  next()
}


module.exports = {
  protect,
  roleMiddleware
}