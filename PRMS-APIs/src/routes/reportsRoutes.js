const express = require('express')
const multer = require('multer')
const {
    uploadReports,
    getReports,
    updateReports,
    deleteReports
} = require('../controllers/reportsController')
const { protect, roleMiddleware } = require('../middlewares/authMiddleware')

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '../uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-{file.orignalname}`),
});

const upload = multer({storage})

router.post('/upload-report', protect, roleMiddleware('admin', 'doctor', 'patient', 'nurse', 'receptionist'), uploadReports)
router.get('/reports', protect, roleMiddleware('admin', 'doctor', 'patient', 'nurse', 'receptionist'), getReports)
router.patch('/update-report/:id', protect, roleMiddleware('admin', 'doctor', 'patient', 'nurse', 'receptionist'), updateReports)
router.delete('/delete-report/:id', protect, roleMiddleware('admin', 'doctor', 'patient', 'nurse', 'receptionist'), deleteReports)

module.exports = router