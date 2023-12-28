const Room = require("./../models/room");
const User = require("./../models/user");
const redisClient = require("./../config/redis");
const processAction = require("./pokerLogic");
const Timer = require("./Timer");

const timers = {}; // Keep track of timers for each room

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("connected to head socket");

        socket.on("createRoom", async (callback) => {
            // generate a new room
            const newRoom = await Room.createRoom();

            //generate a new game object !!!
            const gameObject = {
                seats: [
                    {
                        id: 0,
                        username: null,
                        balance: 0,
                    },
                    {
                        id: 1,
                        username: null,
                        balance: 0,
                    },
                    {
                        id: 2,
                        username: null,
                        balance: 0,
                    },
                    {
                        id: 3,
                        username: null,
                        balance: 0,
                    },
                    {
                        id: 4,
                        username: null,
                        balance: 0,
                    },
                    {
                        id: 5,
                        username: null,
                        balance: 0,
                    },
                ],
                button: 0,
                activeRound: {
                    type: "test",
                    turn: 0,
                    actions: [],
                },
            };

            // Save gamestate to redis
            await redisClient.set(
                newRoom.entryCode.toString(),
                JSON.stringify(gameObject),
            );

            //report success to client
            callback({ success: true, entryCode: newRoom.entryCode });
        });

        socket.on("joinRoom", async (entryCode, username, callback) => {
            try {
                // Update mongodb with the new user
                await Room.addPlayer(entryCode, username);

                // Update redis with the new user
                const gameObjectString = await redisClient.get(entryCode);
                let gameObject = JSON.parse(gameObjectString);
                let i = 0;
                for (i; i < gameObject.seats.length; i++) {
                    if (!gameObject.seats[i].username) {
                        gameObject.seats[i].username = username;
                        break;
                    }
                }
                await redisClient.set(
                    entryCode.toString(),
                    JSON.stringify(gameObject),
                );

                // let client know it was a success
                callback({ success: true, seat: i });

                // Update socket data
                socket.join(entryCode);
                socket.username = username;
                socket.entryCode = entryCode;

                // Initialize the timer for the room if not exists
                if (!timers[entryCode]) {
                    timers[entryCode] = new Timer(
                        entryCode,
                        15,
                        (currentTime) => {
                            io.to(entryCode).emit("timerUpdate", currentTime);
                        },
                    );
                    timers[entryCode].start();
                }

                // let other users know that new user has joined
                io.to(entryCode).emit("userJoined", {
                    message: `${username} joined room ${entryCode}`,
                    gameObject: gameObject,
                });

                //debugging
                console.log(`${username} joined room ${entryCode}`);
            } catch (error) {
                console.log(error);
                console.log(
                    `${username} tried to join a room (${entryCode}) that doesn't exist`,
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

        socket.on("action", async (action, entryCode) => {
            //retrieve the gamestate object from redis
            const gameObjectString = await redisClient.get(
                entryCode.toString(),
            );
            let gameObject = JSON.parse(gameObjectString);

            //restart the interval
            timers[entryCode].stop();
            io.to(entryCode).emit("timerUpdate", 15);
            timers[entryCode].start();

            //call game logic function too handle action
            processAction(gameObject, action);

            //emit updated game object to the frontend
            io.to(entryCode).emit("gameUpdate", gameObject);

            //save updated object back to memory using redis
            // Save gamestate to redis
            await redisClient.set(
                entryCode.toString(),
                JSON.stringify(gameObject),
            );
        });

        socket.on("leaveRoom", async (entryCode) => {
            //TODO: CLEAN THIS FUNCTION IT IS DISGUSTING
            if (socket.username == null || entryCode == null) return;

            const username = socket.username;
            const user = await User.findOne({ username });

            try {
                socket.leave(entryCode);

                //remove player from memory in redis
                const gameObjectString = await redisClient.get(entryCode);
                let gameObject = JSON.parse(gameObjectString);
                for (let i = 0; i < gameObject.seats.length; i++) {
                    if (gameObject.seats[i].username === socket.username) {
                        gameObject.seats[i].username = null;
                        break;
                    }
                }
                await redisClient.set(
                    entryCode.toString(),
                    JSON.stringify(gameObject),
                );

                //remove player from mongodb
                const updatedRoom = await Room.removePlayer(
                    entryCode,
                    user.username,
                );

                //if room is empty delete room
                if (!updatedRoom) {
                    console.log("made it here", updatedRoom);
                    console.log(timers);
                    console.log(entryCode);
                    redisClient.del(entryCode);
                    timers[entryCode].stop();
                    delete timers[entryCode];
                }

                //log to backend and frontend
                io.to(socket.entryCode).emit("userLeft", {
                    message: `${socket.username} left room ${entryCode}`,
                    gameObject: gameObject,
                });
                console.log(`${socket.username} left room ${entryCode}`);

                socket.username = null;
                entryCode = null;
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
                    console.log(
                        `${socket.username} left room ${socket.entryCode}`,
                    );
                    socket.leave(socket.entryCode);
                    socket.username = null;
                    socket.entryCode = null;
                });
            }
            console.log(`${username} disconnected from head`);
        });

        async function leaveRoom(username, entryCode) {
            //remove player from memory in redis
            const gameObjectString = await redisClient.get(socket.entryCode);
            let gameObject = JSON.parse(gameObjectString);
            for (let i = 0; i < gameObject.seats.length; i++) {
                if (gameObject.seats[i].username === socket.username) {
                    gameObject.seats[i].username = null;
                    break;
                }
            }
            await redisClient.set(
                socket.entryCode.toString(),
                JSON.stringify(gameObject),
            );
            const user = await User.findOne({ username });

            try {
                const updatedRoom = await Room.removePlayer(
                    entryCode,
                    username,
                );
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
