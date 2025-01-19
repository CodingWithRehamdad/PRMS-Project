const {body} = require('express-validator')

const registerValidator = [
    body('fullName').notEmpty().withMessage('FullName is required'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('dateOfBirth').isDate().withMessage('Invalid date of birth'),
    body('contactInformation.phoneNumber').isMobilePhone('en-PK').withMessage('Invalid Phone Number'),
    body('contactInformation.email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be at list 6 characters'),
    body('role').isIn(['admin', 'doctor', 'patient', 'nurse', 'receptionist']).withMessage('Invalid role. Please select a valid role (admin, doctor, patient, nurse, receptionist).')
]

const loginValidator = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
]

module.exports = {
    registerValidator,
    loginValidator
}