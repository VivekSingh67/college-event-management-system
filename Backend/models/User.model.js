const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["super_admin", "admin", "hod", "coordinator", "faculty", "student"],
      default: "student",
    },

    profile_image: {
      type: String,
      default: "",
    },

    is_verified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    last_login: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("User", userSchema)