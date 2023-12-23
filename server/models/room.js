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

Room.createRoom = async function () {
  // Generate a simple entry code (for simplicity, using a random number)
  const entryCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Create a room in the database
  const room = new Room({
    entryCode,
    players: [],
  });

  // Save the room to the database
  await room.save();

  return room;
};

Room.addPlayer = async function (entryCode, username) {
  // retrieve room
  const room = await Room.findOne({ entryCode }).populate("players");
  if (!room) {
    throw new Error(`Room ${entryCode} not found`);
  }

  // Check if the player is already in the room
  const isPlayerInRoom = room.players.some((p) => p.username === username);
  if (isPlayerInRoom) {
    return room; // Player is already in the room, return the room as is
  }

  // update room with new user
  const userToAdd = await User.findOne({ username });
  if (!userToAdd) {
    throw new Error(`User ${username} not found`);
  }

  room.players.push(userToAdd);
  await room.save();

  return room;
};

// Static method to remove a player from a room
Room.removePlayer = async function (entryCode, username) {
  // retrieve room
  const room = await this.findOne({ entryCode }).populate("players");
  if (!room) {
    throw new Error("Room not found");
  }

  // check if user is in room
  const userToRemove = room.players.find(
    (player) => player.username === username
  );
  if (!userToRemove) {
    throw new Error("Player not found in the room");
  }

  // remove player and save
  room.players = room.players.filter((player) => player.username !== username);
  console.log(room.players);
  console.log(username);
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
