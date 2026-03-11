import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    college_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    branch_name: {
      type: String,
      required: true,
    },

    branch_code: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    pincode: {
      type: String,
    },

    campus_type: {
      type: String,
      enum: ["Main Campus", "City Campus", "Regional Campus"],
      default: "Main Campus",
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

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;