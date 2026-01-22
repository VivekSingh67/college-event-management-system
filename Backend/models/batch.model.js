const mongoose = require('mongoose')

const batchSchema = mongoose.Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true
    },
    departmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    BatchName: {
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
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Batch", batchSchema)