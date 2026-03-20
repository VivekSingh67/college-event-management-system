const mongoose = require("mongoose");

const hodSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    employee_id: {
      type: String,
      required: true,
      unique: true,
    },

    qualification: {
      type: String,
    },

    experience_years: {
      type: Number,
      default: 0,
    },

    joining_date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Hod = mongoose.model("Hod", hodSchema);

module.exports = Hod;