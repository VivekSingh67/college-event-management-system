import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
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

    batch_name: {
      type: String,
      required: true,
    },

    start_year: {
      type: Number,
      required: true,
    },

    end_year: {
      type: Number,
      required: true,
    },

    total_students: {
      type: Number,
      default: 0,
    },

    current_semester: {
      type: Number,
      default: 1,
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

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;