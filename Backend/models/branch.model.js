const mongoose = require('mongoose');

const branchSchema = mongoose.Schema(
    {
        collegeId: {
            type: String,
            required: true
        },
        branchName: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true
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
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Branch', branchSchema);
