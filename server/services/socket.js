const Room = require("./../models/room");
const User = require("./../models/user");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle room creation
    socket.on("createRoom", async (username) => {
      try {
        // Generate a simple entry code (for simplicity, using a random number)
        const entryCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Get host user from database
        const host = await User.findOne({ username });

        console.log(host);

        // Create a room in the database
        const room = new Room({
          entryCode,
          players: [host],
        });

        // Save the room to the database
        await room.save();

        // Join the room
        socket.join(entryCode);
        socket.username = username;
        socket.roomName = entryCode;

        // Notify the user about the room and entry code
        socket.emit("roomCreated", { entryCode });

        console.log(`User created a room with entry code: ${entryCode}`);
      } catch (error) {
        console.error("Error creating room:", error);
        // Handle the error and notify the client if necessary
      }
    });

    socket.on("joinRoom", async (entryCode, username) => {
      // Add user to room in DB
      const user = await User.findOne({ username }).then((room) => {
        console.error(`user with name ${username} does not exist`);
      });
      const room = await Room.findOne({ entryCode }).then((room) => {
        console.error(`room with name ${entry} does not exist`);
      });
      await room.save();

      socket.join(entryCode);
      socket.username = username;
      socket.roomName = entryCode;
      console.log(`${username} joined room ${entryCode}`);
    });

    // Broadcast chat messages to the room
    socket.on("chatMessage", (message) => {
      console.log("Sent Message");
      console.log(socket.username);
      console.log(socket.roomName);
      io.to(socket.roomName).emit("chatMessage", {
        username: socket.username,
        message: message,
      });
    });

    // Leave the room when a user disconnects
    socket.on("disconnect", () => {
      console.log(
        `${socket.username} disconnected from room ${socket.roomName}`
      );
      socket.leave(socket.roomName);
    });
  });
};
