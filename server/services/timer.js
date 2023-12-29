class Timer {
    constructor(entryCode, initialTime, callback) {
        this.entryCode = entryCode;
        this.time = initialTime;
        this.interval = null;
        this.callback = callback;
    }

    start() {
        this.time = 14;
        this.interval = setInterval(async () => {
            const startTime = new Date();
            if (this.time < 1) {
                this.time = 15;
                this.callback(true, this.time--);
            } else this.callback(false, this.time--);
            const endTime = new Date();
            const runtime = endTime - startTime;
            //console.log("interval function runtime:", runtime, "ms");
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
        //console.log(`Timer ${this.entryCode} stopped`);
    }
}

module.exports = Timer;
