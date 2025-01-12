const jwt = require('jsonwebtoken')
const User = require('../models/user.models')


//-----------------Middleware to protect routes--------------------

const protect = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
  
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        token = authHeader.split(' ')[1];
        console.log("Token Received:", token); // Logs received token
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id).select('-password');
        console.log("Authenticated User:", req.user); // Logs authenticated user data
        next();
      } catch (error) {
        console.error("Token Verification Failed:", error.message); // Logs token verification failure
        res.status(401).send({ message: 'Not authorized, invalid token' });
      }
    } else {
      console.error("Authorization Header Missing or Invalid"); // Logs missing/invalid token
      res.status(401).send({ message: 'Not authorized, provide valid token' });
    }
  };

//---------- Middleware to check roles--------------

const roleMiddleware = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)){
        res.status(403).json({message: 'Access denied: insufficient persmission'})
    }
    next()
}


module.exports = {
    protect,
    roleMiddleware
}