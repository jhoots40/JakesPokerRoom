class Deck {
    constructor() {
        const ranks = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
            "A",
        ];
        const suits = ["h", "d", "c", "s"];

        this.cards = ranks.flatMap((rank) => suits.map((suit) => rank + suit));
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    pop() {
        return this.cards.pop();
    }

    reset() {
        const ranks = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
            "A",
        ];
        const suits = ["H", "D", "C", "S"];

        this.cards = ranks.flatMap((rank) => suits.map((suit) => rank + suit));
    }
}

class GameState {
    constructor() {
        this.seats = [
            {
                id: 0,
                username: null,
                balance: 0,
                ready: false,
                holeCards: [],
            },
            {
                id: 1,
                username: null,
                balance: 0,
                ready: false,
                holeCards: [],
            },
            {
                id: 2,
                username: null,
                balance: 0,
                ready: false,
                holeCards: [],
            },
            {
                id: 3,
                username: null,
                balance: 0,
                ready: false,
                holeCards: [],
            },
            {
                id: 4,
                username: null,
                balance: 0,
                ready: false,
                holeCards: [],
            },
            {
                id: 5,
                username: null,
                balance: 0,
                ready: false,
                holeCards: [],
            },
        ];
        this.button = 0;
        this.activeRound = {
            type: "test",
            turn: -1,
            actions: [],
        };
        this.state = "ready";
        this.deck = new Deck();
    }
}

module.exports = GameState;
