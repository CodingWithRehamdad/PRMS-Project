const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// Register User
const registerUser = async (req, res) => {
  try {
    const { fullName, gender, dateOfBirth, contactInformation, role, password } = req.body;

    const validRoles = ["admin", "doctor", "nurse", "patient", "receptionist"];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid role. Please select a valid role.' });
    }

    const userExists = await User.findOne({ 'contactInformation.email': contactInformation.email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    const newUser = new User({ ...req.body, role: role.toLowerCase() });
    await newUser.save();

    res.status(201).json({
      user: newUser,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user.', details: error.message });
  }
};


// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ 'contactInformation.email': email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      message: 'Logged In Successfully',
      token
    });
  } catch (err) {
    console.error("Error Logging In:", err);
    res.status(500).json({ error: err.message });
  }
};

// Logout User
const logout = async (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    console.log("Fetching User Profile:", req.user);
    res.json(req.user);
  } catch (error) {
    console.error("Error Fetching Profile:", error);
    res.status(500).json({ message: 'Error fetching profile', details: error.message });
  }
};

// Update User By Role and Id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {role} = req.query;

    const user = await User.findOneAndUpdate({ _id: id, role: role.toLowerCase }, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }
    res.status(200).json({ message: `${role} updated successfully`, user });
  } catch (error) {
    console.error("Error Updating User:", error);
    res.status(500).json({ message: 'Error updating user', details: error.message });
  }
};

// Delete User by Role and Id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.query;
    const user = await User.findOneAndDelete({ _id: id, role });
    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }
    res.status(200).json({ message: `${role} deleted successfully` });
  } catch (error) {
    console.error("Error Deleting User:", error);
    res.status(500).json({ message: 'Error deleting user', details: error.message });
  }
};

// Get User for Role and ID
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.query;
    const user = await User.findOne({ _id: id, role });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error Fetching User:", error);
    res.status(500).json({ message: 'Error fetching user', details: error.message });
  }
};

// Get All Users by Role
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.params;
    const validRoles = ['admin', 'doctor', 'patient', 'nurse', 'receptionist'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const users = await User.find({ role });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error Fetching Users:", error);
    res.status(500).json({ message: 'Error fetching users', details: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  getProfile,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers
};
