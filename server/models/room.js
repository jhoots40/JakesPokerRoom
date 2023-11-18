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

// Static method to remove a player from a room
Room.removePlayer = async function (entryCode, username) {
  const room = await this.findOne({ entryCode }).populate("players");

  if (!room) {
    throw new Error("Room not found");
  }

  const userToRemove = room.players.find(
    (player) => player.username === username
  );

  if (!userToRemove) {
    throw new Error("Player not found in the room");
  }

  room.players = room.players.filter((player) => player.username !== username);

  await room.save();

  //delete room if that player was the last player in the room
  //this way a room cannot be deleted until somebody leaves
  if (room.players.length === 0) {
    await room.remove();
    return null;
  }

  return room;
};

module.exports = Room;
