const mongoose = require("mongoose");
const User = require("./user");

const roomSchema = new mongoose.Schema({
  entryCode: {
    type: Number,
    required: true,
    unique: true,
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
