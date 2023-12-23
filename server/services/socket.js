const Room = require("./../models/room");
const User = require("./../models/user");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("connected to head socket");

    socket.on("createRoom", async (callback) => {
      // generate a new room
      const newRoom = await Room.createRoom();

      //report success to client
      callback({ success: true, entryCode: newRoom.entryCode });
    });

    socket.on("joinRoom", async (entryCode, username, callback) => {
      try {
        // Update the database with the new user
        await Room.addPlayer(entryCode, username);

        // let client know it was a success
        callback({ success: true });

        // Update socket data
        socket.join(entryCode);
        socket.username = username;
        socket.entryCode = entryCode;

        // let other users know that new user has joined
        io.to(socket.entryCode).emit("userJoined", {
          message: `${username} joined room ${entryCode}`,
        });

        //debugging
        console.log(`${username} joined room ${entryCode}`);
      } catch (error) {
        console.log(
          `${username} tried to join a room (${entryCode}) that doesn't exist`
        );
        callback({ success: false });
      }
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

      const username = socket.username;
      const user = await User.findOne({ username });

      try {
        const updatedRoom = await Room.removePlayer(
          socket.entryCode,
          user.username
        );
        console.log(`${socket.username} left room ${socket.entryCode}`);
        io.to(socket.entryCode).emit("userLeft", {
          message: `${socket.username} left room ${socket.entryCode}`,
        });
        socket.leave(socket.entryCode);
        socket.username = null;
        socket.entryCode = null;
      } catch (error) {
        console.error(error.message);
      }
    });

    // Leave the connection
    socket.on("disconnect", (username) => {
      if (socket.username && socket.entryCode) {
        console.log("FORCED DISCONNECT");
        // TODO: SLOPPY IMPLEMENTATION FIX LATER
        leaveRoom(socket.username, socket.entryCode).then(() => {
          console.log(`${socket.username} left room ${socket.entryCode}`);
        });
      }
      console.log(`${username} disconnected from head`);
    });

    async function leaveRoom(username, entryCode) {
      const user = await User.findOne({ username });

      try {
        const updatedRoom = await Room.removePlayer(entryCode, username);
        io.to(entryCode).emit("userLeft", {
          message: `${username} left room ${entryCode}`,
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  });
};
