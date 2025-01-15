const bcrypt = require('bcrypt');
const User = require('../models/userModels');
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
  console.log("Incoming Login Data:", req.body); // Logs login data

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
} catch (err) {
    res.status(500).json({ error: err.message });
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
