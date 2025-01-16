const Patient = require('../models/patientModel')

// getAllPatients
const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('userId', 'fullName contactInformation')
        return res.status(200).json(patients)
    } catch (error) {
        res.status(500).json({error: err.message})
    }
};

//getPatientById
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('userId', 'fullName contactInformation')
        if(!patient) {
            return res.status(404).json({message: 'Patient not found'})    
        }
        res.status(200).json(patient)
    } catch (error) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    getAllPatients,
    getPatientById
}