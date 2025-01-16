const Appointment = require('../models/appointmentModel')

//createAppointment
const createAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({...req.body, patientId: req.user,_id})
        await appointment.save()
        return res.status(201).json({message: 'Appointment Created Successfully'})
    } catch (error) {
        res.status(500).json({error: err.message})
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
        res.status(500).json({error: err.message})
    }
};

//updateAppointment
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!appointment) {
           return res.status(404).json({message: 'Appointment not found'})
        }
        res.status(200).json({message: 'Appointment updated', appointment})
    } catch (error) {
        res.status(500).json({error: err.message})
    }
};

//deleteAppointment
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id)
        if(!appointment) {
        return res.status(404).json({message: 'Appointment not found'})
    }
        res.status(200).json({message: 'Appointment deleted'})
    } catch (error) {
        res.status(500).json({error: err.message})
    }  
};

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment
}
