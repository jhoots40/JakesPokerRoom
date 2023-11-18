const Room = require("./../models/room");
const User = require("./../models/user");

module.exports = (io) => {
  io.on("connection", (socket) => {
    // Handle room creation
    console.log("connected to head socket");
    socket.on("createRoom", async (callback) => {
      try {
        // Generate a simple entry code (for simplicity, using a random number)
        const entryCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Create a room in the database
        const room = new Room({
          entryCode,
          players: [],
        });

        // Save the room to the database
        await room.save();

        // Notify the user about the room and entry code
        socket.emit("roomCreated", { entryCode });

        console.log(`User created a room with entry code: ${entryCode}`);
        callback({ success: true, entryCode: entryCode });
      } catch (error) {
        console.error("Error creating room:", error);
        // Handle the error and notify the client if necessary
      }
    });

    socket.on("joinRoom", async (entryCode, username) => {
      // Add user to room in DB
      const user = await User.findOne({ username });
      const room = await Room.findOne({ entryCode });

      const flag = true;

      for (let i = 0; i < room.players.length; i++) {
        if (room.players[i].username === username) {
          flag = false;
          break;
        }
      }

      if (flag) {
        room.players.push(user);
        await room.save();
      }

      socket.join(entryCode);
      socket.username = username;
      socket.entryCode = entryCode;
      console.log(`${username} joined room ${entryCode}`);
    });

    // Broadcast chat messages to the room
    socket.on("chatMessage", (message) => {
      io.to(socket.entryCode).emit("chatMessage", {
        username: socket.username,
        message: message,
      });
    });

    socket.on("leaveRoom", async () => {
      if (socket.username == null || socket.entryCode == null) return;
      console.log(`${socket.username} left room ${socket.entryCode}`);

      const username = socket.username;
      const user = await User.findOne({ username });

      try {
        const updatedRoom = await Room.removePlayer(
          socket.entryCode,
          user.username
        );
        console.log("Player removed:", updatedRoom);
      } catch (error) {
        console.error(error.message);
      }
      socket.leave(socket.entryCode);
    });

    // Leave the connection
    socket.on("disconnect", (username) => {
      console.log(`${username} disconnected from head`);
    });
  });
};
