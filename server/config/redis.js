const Redis = require("redis");

const redisClient = Redis.createClient();
redisClient.connect();
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
redisClient.on("connect", () => {
  console.log("Connected to REDIS successfully");
});

module.exports = redisClient;
