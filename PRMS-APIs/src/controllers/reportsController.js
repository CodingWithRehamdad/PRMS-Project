const mongoose = require('mongoose')
const express = require('express')
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

// Update Reports
const updateReports = async (req, res) => {
    try {
        const { patientId, reportId } = req.params;
        const patient = await Patient.findById(patientId)
        if (!patient) {
            res.status(404).json({message: 'Patient not found'})
        }
        const report = await patient.testReports.id(reportId)
        if (!report) {
            res.status(404).json({message: 'Reports not found'})
        }

        if(req.body.fileName) report.fileName = req.body.fileName
        if(req.body.filePath) report.filePath = req.body.filePath
        if(req.body.uploadedAt) report.uploadedAt = req.body.uploadedAt

        await patient.save();
        res.status(200).json({message: 'Reports updated successfully'})
    } catch (error) {
        res.status(500).json({error: err.message})
    }
};

// Delete Reports
const deleteReports = async (req, res) => {
    try {
        const { patientId, reportId } = req.params;
        const patient = await Patient.findById(patientId)
        if(!patient) {
            res.status(404).json({message: 'Patient not found'})
        }
        const report = await Patient.testReports.id(reportId)
        if(!report) {
            res.status(404).json({message: 'Report not found'})
        }

        report.remove()
        await patient.save()
        res.status(200).json({message: 'Report deleted successfully'})

    } catch (error) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    router,
    uploadReports,
    getReports,
    updateReports,
    deleteReports
}