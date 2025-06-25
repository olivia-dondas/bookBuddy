const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: { type: String, required: true },
  label: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reward", rewardSchema);
