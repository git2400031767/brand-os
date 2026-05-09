const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  title: String,
  platform: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Idea", IdeaSchema);
