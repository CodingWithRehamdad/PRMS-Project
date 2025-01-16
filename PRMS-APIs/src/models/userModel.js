const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    userName: {type: String, required: 'true'},
    gender: {type: String, enum: ["Male", "Female", "Other"], required: true},
    dateOfBirth: {type: Date, required: true},
    contactInformation: {
        phoneNumber: {type: String, required: true},
        email: {type: String, required: true},
        address: {type: String, required: true}
        },
    role:{
        type: String,
        enum: ["Admin", "Doctor", "Nurse", "Patient", "Receptionist"],
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    // Role specific Details
    doctorDetails: {
        medicalLicenseNumber: {type: String},
        specialization: {type: String},
        qualifications: {type: String},
        yearsOfExperience: {type: String},
        hosptialDepartment: {type: String},
        workSchedule: {type: String}
    },
    nurseDetails: {
        nurseLicenseNumber: {type: String},
        specialization: {type: String},
        yearsOfExperience: {type: String},
        qualifications: {type: String},
        yearsOfExperience: {type: String},
        assginedDoctor: [{type: mongoose.Schema.Types.ObjectId, ref: "Doctor"}],
        workSchedule: {type: String}
    },
    receptionist: {
        employeeId: {type: String},
        yearsOfExperience: {type: String},
        department: {type: String},
        workSchedule: {type: String}
    },

    isActive: {
        type: Boolean, default: true
    }

}, {timestamps: true})


// Modify toJSON to exclude sensitive fields like password
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password; // Exclude sensitive data
    delete user.__v;      // Exclude version key
    return user;
  };

// ----- Hash Password before saving in DB-------------

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next()
        console.log("Hashing Password"); // Logs password hashing
        this.password = await bcrypt.hash(this.password, 8)
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User