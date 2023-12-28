class Timer {
    constructor(entryCode, initialTime, callback) {
        this.entryCode = entryCode;
        this.time = initialTime;
        this.interval = null;
        this.callback = callback;
    }

    start() {
        this.time = 14;
        this.interval = setInterval(() => {
            const startTime = new Date();
            if (this.time < 1) {
                // TODO: process game update

                //             let gameObjectString = await redisClient.get(
                //                 entryCode.toString(),
                //             );
                //             let gameObject = JSON.parse(gameObjectString);
                //             processAction(gameObject, { type: "fold" });
                //             await redisClient.set(
                //                 entryCode.toString(),
                //                 JSON.stringify(gameObject),
                //             );
                //             timers[entryCode].time = 10;
                //             io.to(entryCode).emit("gameUpdate", gameObject);

                // restart timer
                this.time = 15;
            }
            this.callback(this.time--);
            const endTime = new Date();
            const runtime = endTime - startTime;
            console.log("interval function runtime:", runtime, "ms");
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
        console.log(`Timer ${this.entryCode} stopped`);
    }
}

module.exports = Timer;
