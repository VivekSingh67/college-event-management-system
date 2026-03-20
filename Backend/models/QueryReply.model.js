const mongoose = require("mongoose");

const queryReplySchema = new mongoose.Schema(
  {
    query_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
      required: true,
    },

    replied_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const QueryReply = mongoose.model("QueryReply", queryReplySchema);

module.exports = QueryReply;