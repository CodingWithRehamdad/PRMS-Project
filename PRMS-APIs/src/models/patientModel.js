const mongoose = require('mongoose')

const medicalHistorySchema = new mongoose.Schema({
    chronicConditions: [String],
    pastProcedures: [String],
    allergies: [String],
    familyHistory: [String],
    lifeStyle: [String]
});

const medicationSchema = new mongoose.Schema({
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    notes: String
});

const testReportsSchema = new mongoose.Schema({
    fileName: String,
    filePath: String,
    uploadedAt: {
        type: Date, 
        default: Date.now
    }
});

const patientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    insuranceDetails: {
        provider: String,
        policyNumber: String
    },
    medicalHistory: [medicalHistorySchema],
    medications: [medicationSchema],
    testReports: [testReportsSchema]
}, {timestamps: true})

const Patient = mongoose.model('Patient', patientSchema)

module.exports = Patient