const express = require(express)
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

router.post('./newappointment', protect, roleMiddleware('Admin', 'Patient', 'Receptionist'), createAppointment)
router.get('/appointments', protect, roleMiddleware('Admin', 'Patient', 'Receptionist'), getAppointments)
router.update('/updateappointment/:id', protect, roleMiddleware('Admin', 'Patient', 'Receptionist'), updateAppointment)
router.delete('/deleteappointment/:id', protect, roleMiddleware('Admin', 'Patient', 'Receptionist'), deleteAppointment)

module.exports = router