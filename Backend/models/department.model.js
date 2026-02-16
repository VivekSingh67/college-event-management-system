const mongoose = require('mongoose')

const departmentSchema = mongoose.Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true
    },
    departmentName: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Department", departmentSchema)