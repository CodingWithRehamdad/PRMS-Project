const { ObjectId } = require('mongoose').Types; // Import ObjectId directly
const Appointment = require('../models/appointmentModel')
const User = require('../models/userModel')
const Patient = require('../models/patientModel')

//createAppointment
const createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, time, notes } = req.body
        if (!patientId) {
            res.status(400).json({message: 'Patient ID is required'})
        }
        const appointment = new Appointment({ patientId, doctorId: doctorId || null, date, time, notes})
        await appointment.save()
        return res.status(201).json({message: 'Appointment Created Successfully'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }   
};

//getAppointment
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
        .populate('patientId', 'fullName')
        .populate('doctorId', 'fullName')
        return res.status(200).json(appointments)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

//updateAppointment
const updateAppointment = async (req, res) => {
    try {
        const { patientId } = req.body;

        // Validate patientId
        if (!patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        // Ensure patientId is a valid ObjectId
        if (!ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: 'Invalid Patient ID' });
        }

        // Find and update the appointment by patientId
        const appointment = await Appointment.findOneAndUpdate(
            { patientId: new ObjectId(patientId) }, // Use ObjectId directly
            req.body, // Update fields from request body
            { new: true } // Return the updated document
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found for the provided patient' });
        }

        res.status(200).json({ message: 'Appointment updated successfully', appointment });
    } catch (error) {
        console.error('Error updating appointment:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { updateAppointment };



// const updateAppointment = async (req, res) => {
//     try {
//         const {patientId} = req.body
//         if (!patientId) {
//             return res.status(400).json({ message: 'Patient ID is required' });
//         }
//         if (!mongoose.Types.ObjectId.isValid(patientId)) {
//             return res.status(400).json({ message: 'Invalid Patient ID' });
//         }
//         const appointment = await Appointment.findOneAndUpdate({patientId: mongoose.Types.ObjectId(patientId)}, 
//         req.body, 
//         {new: true});

//         if(!appointment) {
//            return res.status(404).json({message: 'Appointment not found'})
//         }
//         res.status(200).json({message: 'Appointment updated', appointment})
//     } catch (error) {
//         res.status(500).json({error: error.message})
//     }
// };

//deleteAppointment
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id)
        if(!appointment) {
        return res.status(404).json({message: 'Appointment not found'})
    }
        res.status(200).json({message: 'Appointment deleted'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }  
};

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment
}
