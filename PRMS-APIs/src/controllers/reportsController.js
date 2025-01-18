const mongoose = require('mongoose')
const Patient = require('../models/patientModel');
const router = express.Router()

// Uploade Reports
const uploadReports = async (req, res) => {
    try {
        const patient = await Patient.findById(req.body.patientId)
        if (!patient) {
            return res.status(404).json({message: 'Patient not found'})
        }
        const report = {
            fileName: req.file.fileName,
            filePath: req.file.filePath,
            uploadedAt: new Date(),
        }
        patient.testReports.push(report)
        await patient.save()
        res.status(201).json({message: 'Report uploaded successfully', report})
    } catch (error) {
        res.status(500).json({error: err.message})
    }
};

// Get Reports
const getReports = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId).select('testReport')
        if (!patient) {
            return res.status(404).json({message: 'Patient not found'})
        }
        res.status(200).json(patient.testReports)
    } catch (error) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    router,
    uploadReports,
    getReports
}