const Room = require("./../models/room");

const getAllRooms = async (req, res) => {
  try {
    const filter = {};
    const rooms = await Room.find(filter);
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllRooms,
};
