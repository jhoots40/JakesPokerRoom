const Room = require("./../models/room");
const User = require("./../models/user");
const redisClient = require("./../config/redis");

const timers = {}; // Keep track of timers for each room

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("connected to head socket");

    socket.on("createRoom", async (callback) => {
      // generate a new room
      const newRoom = await Room.createRoom();

      console.log(newRoom);

      // TODO: generate game state object
      redisClient.lPush(`rooms`, JSON.stringify(newRoom));

      //report success to client
      callback({ success: true, entryCode: newRoom.entryCode });
    });

    socket.on("joinRoom", async (entryCode, username, callback) => {
      try {
        // Update the database with the new user
        await Room.addPlayer(entryCode, username);

        // Update redis with the new user

        // let client know it was a success
        callback({ success: true });

        // Update socket data
        socket.join(entryCode);
        socket.username = username;
        socket.entryCode = entryCode;

        // Initialize the timer for the room if not exists
        if (!timers[entryCode]) {
          io.to(entryCode).emit("timerUpdate", 60);
          timers[entryCode] = {
            time: 59,
            interval: setInterval(() => {
              // Update the timer every second
              console.log(
                `Timer on room ${entryCode}: ${timers[entryCode].time}`
              );
              io.to(entryCode).emit("timerUpdate", timers[entryCode].time--);
            }, 1000),
          };
        }

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

    socket.on("action", (entryCode) => {
      //restart the interval
      io.to(entryCode).emit("timerUpdate", 60);
      clearInterval(timers[socket.entryCode].interval);
      timers[socket.entryCode].interval = setInterval(() => {
        console.log(`Timer on room ${entryCode}: ${timers[entryCode].time}`);
        io.to(entryCode).emit("timerUpdate", timers[entryCode].time--);
      }, 1000);

      timers[entryCode].time = 59;
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
        if (!updatedRoom) {
          clearInterval(timers[socket.entryCode].interval);
          delete timers[socket.entryCode];
        }
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
          socket.leave(socket.entryCode);
          socket.username = null;
          socket.entryCode = null;
        });
      }
      console.log(`${username} disconnected from head`);
    });

    async function leaveRoom(username, entryCode) {
      const user = await User.findOne({ username });

      try {
        const updatedRoom = await Room.removePlayer(entryCode, username);
        if (!updatedRoom) {
          clearInterval(timers[entryCode].interval);
          delete timers[entryCode];
        }
        io.to(entryCode).emit("userLeft", {
          message: `${username} left room ${entryCode}`,
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  });
};
