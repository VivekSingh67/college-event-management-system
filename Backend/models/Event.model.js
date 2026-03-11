import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },

    event_title: {
      type: String,
      required: true,
    },

    event_type: {
      type: String,
      enum: ["Sports", "Technical", "Cultural", "Workshop", "Seminar"],
      required: true,
    },

    event_description: {
      type: String,
    },

    event_banner: {
      type: String,
    },

    event_date: {
      type: Date,
      required: true,
    },

    start_time: {
      type: String,
    },

    end_time: {
      type: String,
    },

    location: {
      type: String,
    },

    max_participants: {
      type: Number,
      default: 0,
    },

    registration_deadline: {
      type: Date,
    },

    organizer_name: {
      type: String,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    created_by_role: {
      type: String,
      enum: ["admin", "hod", "faculty"],
      required: true,
    },

    approval_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    event_status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;