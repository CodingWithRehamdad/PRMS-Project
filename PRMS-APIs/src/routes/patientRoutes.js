const express = require('express')
const { getAllPatients, getPatientById } = require('../controllers/patientController')
const { protect, roleMiddleware } = require('../middlewares/authMiddleware')

const router = express.Router();

router.get('/patients', getAllPatients)
router.get('/patient/:id', protect, roleMiddleware('admin', 'doctor', 'nurse'), getPatientById)

module.exports = router