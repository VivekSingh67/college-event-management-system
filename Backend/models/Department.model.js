const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    department_name: {
      type: String,
      required: true,
    },

    department_code: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
    },

    total_faculty: {
      type: Number,
      default: 0,
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

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;