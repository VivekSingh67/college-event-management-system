const mongoose = require("mongoose")

const studentSchema = mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            trim: true
        },
        lastname: {
            type: String,
            trim: true
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: Number,
        require: true,
        trim: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        require: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        require: true
    },
    Batch: {
        type: String,
        require: true,
        trim: true
    },
    year: {
        type: Number,
        require: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("student", studentSchema)