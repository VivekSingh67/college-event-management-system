const mongoose = require("mongoose");

const eventVenueSchema = new mongoose.Schema(
  {
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    venue_name: {
      type: String,
      required: true,
    },

    location: {
      type: String,
    },

    capacity: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const EventVenue = mongoose.model("EventVenue", eventVenueSchema, "event_venues");

module.exports = EventVenue;