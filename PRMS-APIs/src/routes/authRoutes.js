const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  logout,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers
} = require("../controllers/authController");
const { protect, roleMiddleware } = require("../middlewares/authMiddleware");
const { registerValidator, loginValidator } = require("../validators/authValidator");
const { validationResult } = require("express-validator");
const { getAllPatients, getPatientById } = require('../controllers/patientController')

const router = express.Router();

// Helper middleware to check validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation Errors:", errors.array()); // Logs validation errors
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Public routes
router.post("/register", registerValidator, handleValidation, registerUser);
router.post("/login", loginValidator, handleValidation, loginUser);
router.post('/logout', protect, logout)
router.patch('/update/:id', protect, updateUser)
router.delete('/delete/:id', deleteUser)


// Protected routes
router.get("/profile", protect, getProfile);
router.get('/user/:id', getUser)
router.get('/users', getAllUsers)


// Role-based routes
router.get("/admin", protect, roleMiddleware("Admin"), (req, res) => {
  res.send("Welcome, Admin!");
});

router.get("/doctor", protect, roleMiddleware("Doctor"), (req, res) => {
  res.send("Welcome, Doctor!");
});

router.get("/nurse", protect, roleMiddleware("Nurse"), (req, res) => {
  res.send("Welcome, nurse!");
});

router.get("/patient", protect, roleMiddleware("Patient"), (req, res) => {
  res.send("Welcome, patient!");
});

router.get("/receptionist", protect, roleMiddleware("Receptionist"), (req, res) => {
  res.send("Welcome, receptionist!");
});

module.exports = router

