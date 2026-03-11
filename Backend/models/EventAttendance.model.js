import mongoose from "mongoose";

const eventAttendanceSchema = new mongoose.Schema(
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

    attendance_status: {
      type: Boolean,
      default: false,
    },

    marked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    marked_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const EventAttendance = mongoose.model(
  "EventAttendance",
  eventAttendanceSchema,
);

export default EventAttendance;