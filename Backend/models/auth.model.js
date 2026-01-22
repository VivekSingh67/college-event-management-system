const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        trim: true
      },
      lastname: {
        type: String,
        trim: true
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ["superAdmin", "admin", "hod", "student"],
      default: "student"
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', authSchema);
