const redisClient = require("./../config/redis");

const processAction = (gameObject, action) => {
    gameObject.activeRound.actions.push(action);

    // update turn
    nextTurn = gameObject.activeRound.turn + 1;
    for (let i = nextTurn; i < nextTurn + 6; i++) {
        if (gameObject.seats[i % 6].username) {
            gameObject.activeRound.turn = i % 6;
            break;
        }
    }

    // log action to server for debugging
    console.log(gameObject);
};

module.exports = processAction;
