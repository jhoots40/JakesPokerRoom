class GameState {
    constructor() {
        this.seats = [
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
        ];
        this.button = 0;
        this.activeRound = {
            type: "test",
            turn: 0,
            actions: [],
        };
    }
}

module.exports = GameState;
