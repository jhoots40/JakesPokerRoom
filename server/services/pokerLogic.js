const redisClient = require("./../config/redis");
const GameState = require("./gameState");

// no race conditions
const newGameState = async (entryCode) => {
    const gameState = new GameState();
    // Save gamestate to redis
    await redisClient.set(entryCode.toString(), JSON.stringify(gameState));
};

// race conditions
const addPlayer = async (entryCode, username, callback) => {
    // Update redis with the new user
    const gameStateString = await redisClient.get(entryCode);
    let gameState = JSON.parse(gameStateString);
    let i = 0;
    for (i; i < gameState.seats.length; i++) {
        if (!gameState.seats[i].username) {
            gameState.seats[i].username = username;
            break;
        }
    }
    await redisClient.set(entryCode.toString(), JSON.stringify(gameState));
    callback(gameState, i);
};

// race conditions
const processAction = async (entryCode, action, callback) => {
    const gameStateString = await redisClient.get(entryCode);
    let gameState = JSON.parse(gameStateString);

    gameState.activeRound.actions.push(action);

    // update turn
    nextTurn = gameState.activeRound.turn + 1;
    for (let i = nextTurn; i < nextTurn + 6; i++) {
        if (gameState.seats[i % 6].username) {
            gameState.activeRound.turn = i % 6;
            break;
        }
    }

    await redisClient.set(entryCode.toString(), JSON.stringify(gameState));
    callback(gameState);
};

// race conditions
const delPlayer = async (entryCode, username, callback) => {
    //remove player from memory in redis
    const gameStateString = await redisClient.get(entryCode);
    let gameState = JSON.parse(gameStateString);
    for (let i = 0; i < gameState.seats.length; i++) {
        if (gameState.seats[i].username === username) {
            gameState.seats[i].username = null;
            break;
        }
    }
    await redisClient.set(entryCode.toString(), JSON.stringify(gameState));
    callback(gameState);
};

// no race conditions, gameState will only get deleted after everybody has left room
const deleteGameState = async (entryCode) => {
    await redisClient.del(entryCode);
};

module.exports = {
    processAction,
    newGameState,
    deleteGameState,
    delPlayer,
    addPlayer,
};
