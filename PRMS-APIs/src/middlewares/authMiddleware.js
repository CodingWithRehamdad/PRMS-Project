const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsyncErrors = require('./catchAsyncError')


//-----------------Middleware to protect routes--------------------

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      next();
  } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
  }
};

//---------- Middleware to check roles--------------

const roleMiddleware = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403).json({ message: 'Access denied: insufficient persmission' })
  }
  next()
}


module.exports = {
  protect,
  roleMiddleware
}