const express = require('express')
const { getAllPatients, getPatientById } = require('../controllers/patientController')
const { protect, roleMiddleware } = require('../middlewares/authMiddleware')

const router = express.Router();

router.get('/patients', protect, roleMiddleware('Admin', 'Doctor', 'Nurse'), getAllPatients)
router.get('/patient/:id', protect, roleMiddleware('Admin', 'Doctor', 'Nurse'), getPatientById)

module.exports = router