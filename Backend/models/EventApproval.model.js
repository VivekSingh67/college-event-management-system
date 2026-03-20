const mongoose = require("mongoose");

const eventApprovalSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approver_role: {
      type: String,
      enum: ["admin", "super_admin"],
      required: true,
    },

    approval_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    remarks: {
      type: String,
    },

    approval_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const EventApproval = mongoose.model("EventApproval", eventApprovalSchema);

module.exports = EventApproval;