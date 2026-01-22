const mongoose = require('mongoose');

const branchSchema = mongoose.Schema(
    {
        branchName: {
            type: String,
            required: true
        },
        branchAddress: {
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
