class Timer {
    constructor(entryCode, initialTime, callback) {
        this.entryCode = entryCode;
        this.time = initialTime;
        this.resetTime = initialTime;
        this.interval = null;
        this.callback = callback;
    }

    start() {
        this.callback(false, this.resetTime);
        this.time = this.resetTime - 1;
        this.interval = setInterval(() => {
            const startTime = new Date();
            if (this.time < 1) {
                clearInterval(this.interval);
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
