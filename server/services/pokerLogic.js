const GameState = require("./gameState");
const AsyncLock = require("async-lock");
const Timer = require("./Timer");

const currentGames = {};
const lock = new AsyncLock({ maxPending: 1 });

class TexasHoldemUtils {
    // no race conditions
    static newGameState = async (entryCode) => {
        currentGames[entryCode] = new GameState();
        console.log(currentGames);
    };

    // race conditions
    static addPlayer = async (entryCode, username, callback) => {
        process.stdout.write(`<${entryCode}`);
        let gameState = currentGames[entryCode];
        let i = 0;
        for (i; i < gameState.seats.length; i++) {
            if (!gameState.seats[i].username) {
                gameState.seats[i].username = username;
                break;
            }
        }
        await callback(gameState, i);
        process.stdout.write(`>\n`);
    };

    // race conditions
    static processAction = (entryCode, action, emitGameState, emitTimer) => {
        const game = currentGames[entryCode];
        switch (game.state) {
            case "ready":
                this.handleReadyStateAction(
                    game,
                    entryCode,
                    action,
                    emitGameState,
                    emitTimer,
                );
                break;
            case "betting":
                game.activeRound.actions.push(action);
                this.updateTurn(game);
                emitGameState(game);
                global.timers[entryCode].stop();
                emitTimer(5);
                global.timers[entryCode].start();
                break;
            default:
                console.log("state does not exist");
                break;
        }
    };

    // race conditions
    static delPlayer = async (entryCode, username, callback) => {
        await lock.acquire(entryCode, async () => {
            process.stdout.write(`<${entryCode}`);
            let gameState = currentGames[entryCode];
            for (let i = 0; i < gameState.seats.length; i++) {
                if (gameState.seats[i].username === username) {
                    gameState.seats[i].username = null;
                    break;
                }
            }
            await callback(gameState);
            process.stdout.write(`>\n`);
        });
    };

    // no race conditions, gameState will only get deleted after everybody has left room
    static deleteGameState = async (entryCode) => {
        delete currentGames[entryCode];
    };

    static dealInitialCards() {
        // ... (deal initial private cards logic using this.gameState)
    }

    static dealFlop() {
        // ... (deal flop logic using this.gameState)
    }

    static dealTurn() {
        // ... (deal turn logic using this.gameState)
    }

    static dealRiver() {
        // ... (deal river logic using this.gameState)
    }

    static updateTurn(gameState) {
        // update turn
        let nextTurn = gameState.activeRound.turn + 1;
        for (let i = nextTurn; i < nextTurn + 6; i++) {
            if (gameState.seats[i % 6].username) {
                gameState.activeRound.turn = i % 6;
                break;
            }
        }
    }

    static dealHoleCards(
        gameState,
        entryCode,
        action,
        emitGameState,
        emitTimer,
    ) {
        if (global.timers[entryCode]) delete global.timers[entryCode];

        gameState.deck.shuffle();
        for (let round = 0; round < 2; round++) {
            for (let i = 0; i < gameState.seats.length; i++) {
                if (gameState.seats[i].username) {
                    const cardToDeal = gameState.deck.pop();
                    console.log(
                        `Dealt Card to ${gameState.seats[i].username}`,
                        cardToDeal,
                    );
                    gameState.seats[i].holeCards.push(cardToDeal);
                }
            }
        }
        console.log("Finished Dealing", gameState);

        global.timers[entryCode] = new Timer(
            entryCode,
            2,
            (finished, currentTime) => {
                if (finished) {
                    //we get access to the gameState that is defined upon the creation of the timer
                    // closure allows us to access the updated version of state eveytime we call this
                    gameState.state = "betting";
                    emitGameState(gameState);
                }
                emitTimer(currentTime);
            },
        );
        emitGameState(gameState);
        global.timers[entryCode].start();
    }

    static handleReadyStateAction(
        gameState,
        entryCode,
        action,
        emitGameState,
        emitTimer,
    ) {
        //set player to ready/not ready
        gameState.seats[action.seatId].ready =
            !gameState.seats[action.seatId].ready;

        //check if everybody else is ready
        let ready = true;
        for (let i = 0; i < gameState.seats.length; i++) {
            if (gameState.seats[i].username) {
                if (!gameState.seats[i].ready) {
                    ready = false;
                    break;
                }
            }
        }

        // if everybody else is ready
        if (ready) {
            delete global.timers[entryCode];
            // create new timer which starts betting round when it finishes
            global.timers[entryCode] = new Timer(
                entryCode,
                5,
                (finished, currentTime) => {
                    if (finished) {
                        //we get access to the gameState that is defined upon the creation of the timer
                        // closure allows us to access the updated version of state eveytime we call this
                        gameState.state = "dealing";
                        this.dealHoleCards(
                            gameState,
                            entryCode,
                            action,
                            emitGameState,
                            emitTimer,
                        );
                        return;
                    }
                    emitTimer(currentTime);
                },
            );
            // start timer
            global.timers[entryCode].start();
        } else {
            // we are not ready, stop timer
            if (global.timers[entryCode]) {
                global.timers[entryCode].stop();
                emitTimer(5);
                delete global.timers[entryCode];
            }
        }
        emitGameState(gameState);
    }
}

module.exports = TexasHoldemUtils;
