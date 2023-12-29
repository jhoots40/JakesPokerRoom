const Room = require("./../models/room");
const User = require("./../models/user");
const redisClient = require("./../config/redis");
const pokerLogic = require("./pokerLogic");
const Timer = require("./Timer");

const timers = {}; // Keep track of timers for each room

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("connected to head socket");

        socket.on("createRoom", async (callback) => {
            // generate a new room
            const newRoom = await Room.createRoom();

            // generate new game state for the new entryCode
            await pokerLogic.newGameState(newRoom.entryCode);

            //report success to client
            callback({ success: true, entryCode: newRoom.entryCode });
        });

        socket.on("joinRoom", async (entryCode, username, callback) => {
            try {
                // Update mongodb with the new user
                await Room.addPlayer(entryCode, username);

                // Update socket data
                socket.join(entryCode);
                socket.username = username;
                socket.entryCode = entryCode;

                // Initialize the timer for the room if not exists
                if (!timers[entryCode]) {
                    timers[entryCode] = new Timer(
                        entryCode,
                        15,
                        async (finished, currentTime) => {
                            if (finished) {
                                await pokerLogic.processAction(
                                    entryCode,
                                    {
                                        type: "fold",
                                    },
                                    (updatedState) => {
                                        io.to(entryCode).emit(
                                            "gameUpdate",
                                            updatedState,
                                        );
                                    },
                                );
                            }
                            io.to(entryCode).emit("timerUpdate", currentTime);
                        },
                    );
                    timers[entryCode].start();
                }

                // update game state with new player
                pokerLogic.addPlayer(
                    entryCode,
                    username,
                    (updatedState, seat) => {
                        // let other users know that new user has joined
                        callback({ success: true, seat: seat });
                        io.to(entryCode).emit("userJoined", {
                            message: `${username} joined room ${entryCode}`,
                            gameObject: updatedState,
                        });
                    },
                );

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
            //call game logic function to handle action
            //users might be able to send multiple actions to the server before I emit the new game update,
            //i belive this should be solved with race condition
            //I think the way I solve this is whatever action gets received first is the one that is handled,
            //if any action reaches the lock and it is not avvailable, that action is lost

            //we need a seperate logic, for the case where a user tries to join the room and we recieve an action update at the
            //same time
            await pokerLogic.processAction(
                entryCode,
                action,
                (updatedState) => {
                    //emit updated game object to the frontend
                    io.to(entryCode).emit("gameUpdate", updatedState);
                },
            );

            //restart the interval
            timers[entryCode].stop();
            io.to(entryCode).emit("timerUpdate", 15);
            timers[entryCode].start();
        });

        socket.on("leaveRoom", async (entryCode) => {
            if (socket.username && socket.entryCode) {
                console.log("NORMAL DISCONNECT");
                leaveRoom(socket.username, socket.entryCode).then(() => {
                    socket.leave(socket.entryCode);
                    socket.username = null;
                    socket.entryCode = null;
                });
            } else {
                console.error(
                    "socket.username and/or socket.entryCode is null when leaving rooms",
                );
            }
        });

        // Leave the connection
        socket.on("disconnect", (username) => {
            if (socket.username && socket.entryCode) {
                console.log("FORCED DISCONNECT");
                leaveRoom(socket.username, socket.entryCode).then(() => {
                    socket.leave(socket.entryCode);
                    socket.username = null;
                    socket.entryCode = null;
                });
            }
            console.log(`${username} disconnected from head`);
        });

        async function leaveRoom(username, entryCode) {
            try {
                //remove player from memory in redis
                await pokerLogic.delPlayer(
                    entryCode,
                    username,
                    (updatedState) => {
                        //log to backend and frontend
                        io.to(entryCode).emit("userLeft", {
                            message: `${username} left room ${entryCode}`,
                            gameObject: updatedState,
                        });
                    },
                );

                //remove player from mongodb
                const updatedRoom = await Room.removePlayer(
                    entryCode,
                    username,
                );

                //if room is empty delete room
                if (!updatedRoom) {
                    pokerLogic.deleteGameState(entryCode);
                    timers[entryCode].stop();
                    delete timers[entryCode];
                }

                console.log(`${username} left room ${entryCode}`);
            } catch (e) {
                console.error(e);
            }
        }
    });
};
