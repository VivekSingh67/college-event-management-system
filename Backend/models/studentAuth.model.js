const mongoose = require('mongoose');

const registerStudentModel = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    mobile: {
        type: Number,
        require: true
    },
    department: {
        type: String,
    },
    year: {
        type: String
    },
    role: {
        type: String,
        default: "student"
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('student', registerStudentModel)