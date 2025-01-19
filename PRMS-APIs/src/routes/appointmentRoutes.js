const express = require('express')
const {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment
        } = require('../controllers/appointmentController')
const {
    protect,
    roleMiddleware
        } = require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/new-appointment', protect, roleMiddleware('admin', 'patient', 'receptionist'), createAppointment)
router.get('/appointments', protect, roleMiddleware('admin', 'patient', 'receptionist'), getAppointments)
router.patch('/update-appointment/:id', protect, roleMiddleware('admin', 'patient', 'receptionist'), updateAppointment)
router.delete('/delete-appointment/:id', protect, roleMiddleware('admin', 'patient', 'receptionist'), deleteAppointment)

module.exports = router