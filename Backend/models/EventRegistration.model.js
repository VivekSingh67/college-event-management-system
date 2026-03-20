const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    team_name: {
      type: String,
    },

    registration_date: {
      type: Date,
      default: Date.now,
    },

    payment_status: {
      type: String,
      enum: ["free", "pending", "paid"],
      default: "free",
    },

    attendance_status: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["registered", "cancelled", "completed"],
      default: "registered",
    },
  },
  {
    timestamps: true,
  }
);

const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);

module.exports = EventRegistration;