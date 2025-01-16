const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// Register User
const registerUser = async (req, res) => {
  const { fullName, gender, dateOfBirth, contactInformation, role, password } = req.body;
  const validRoles = ["Admin", "Doctor", "Nurse", "Patient", "Receptionist"];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Please select a valid role.' });
  }

  try {
    if (await User.findOne({ 'contactInformation.email': contactInformation.email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User(req.body); // Initialize a new user with req.body
    await newUser.save();

    res.status(201).json({
      user: newUser,
      token: generateToken(newUser._id)
    })

  } catch (error) {
    res.status(500).send({ error: 'Internal server error', details: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      message: 'Logged In Successfully',
      token,
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout User
const logout = async (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

// Get Profile
const getProfile = async (req, res) => {
  console.log("Fetching User Profile:", req.user); // Logs user profile data
  res.json(req.user);
};

// Update User By Role and Id
const updateUser = async (req, res) => {
  try {
    const { role, id } = req.params

    const user = await User.findOneAndUpdate({ _id: id, role }, req.body, { new: true })
    if (!user) {
      return res.status(404).json({ message: `${role} is not found` })
    }
    res.status(201).json({ message: `${role} updated successfully` })
  } catch (error) {
    res.status(500).json({ error: err.message })
  }
};

// Delete User by Role and Id
const deleteUser = async (req, res) => {
  try {
    const {role, id} = req.params;
    const user = await User.findByIdAndDelete({_id: id, role})
    if (!user) {
      return res.status(404).json({message: `${role} not found`})
    }
    res.status(200).json({message: `${role} deleted successfully`})
  } catch (error) {
    res.status(500).json({error: err.message})
  }
};

// Get User for Role and ID 
const getUser = async (req, res) => {
  try {
    const {id} = req.params
    const user = await User.findOne({_id: id, role})
    if(!user) {
      return res.status(404).json({message: 'User not found'})
    } 
    res.status(200).json({user})
  } catch (error) {
    res.status(500).json({error: err.message})
  }
}

// Get All Users by role
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.params
    const validRoles = ['Doctor', 'Nurse', 'Patient', 'Admin', 'Receptionist']
    if (!validRoles.includes(role)) {
      return res.status(404).json({message: 'Invalid role'})
    }
    const users = await User.find({role})
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({error: err.message})
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
