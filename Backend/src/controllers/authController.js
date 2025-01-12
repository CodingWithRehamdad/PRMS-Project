const bcrypt = require('bcrypt');
const User = require('../models/user.models');
const generateToken = require('../utils/generateToken');

// Register User
const registerUser = async (req, res) => {
  console.log("Incoming Registration Data:", req.body); // Logs registration data

  const { fullName, gender, dateOfBirth, contactInformation, role, password } = req.body;

  try {
    const validRoles = ["Admin", "Doctor", "Nurse", "Patient", "Receptionist"];
    if (!validRoles.includes(role)) {
      console.error("Invalid Role:", role); // Logs invalid role
      return res.status(400).send({ message: 'Invalid role. Please select a valid role.' });
    }

    const userExists = await User.findOne({ 'contactInformation.email': contactInformation.email });
    if (userExists) {
      console.error("User Already Exists:", contactInformation.email); // Logs duplicate user
      return res.status(400).send({ message: 'User already exists' });
    }

    const user = await User.create({
      userName: fullName,
      gender,
      dateOfBirth,
      contactInformation,
      role,
      password
    });

    if (user) {
      console.log("User Created Successfully:", user); // Logs user creation success
      res.status(201).json({
        _id: user._id,
        fullName: user.userName,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      console.error("Invalid User Data"); // Logs invalid user data
      res.status(400).send({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Error Registering User:", error.message); // Logs errors during user registration
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Login User
const loginUser = async (req, res) => {
  console.log("Incoming Login Data:", req.body); // Logs login data

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ 'contactInformation.email': email });
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("User Logged In Successfully:", user); // Logs successful login
      res.json({
        _id: user._id,
        name: user.userName,
        email: user.contactInformation.email,
        token: generateToken(user._id)
      });
    } else {
      console.error("Invalid Email or Password"); // Logs invalid login attempt
      res.status(404).send({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Error Logging In User:", error.message); // Logs errors during login
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  console.log("Fetching User Profile:", req.user); // Logs user profile data
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getProfile
};
