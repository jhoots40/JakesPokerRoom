const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();

// exclusing dotenv config from production
if (process.env.NODE_ENV !== "production") require("dotenv").config();

mongoose.set("strictQuery", true);
mongoose.Promise = global.Promise;
// Connect to MongoDB (replace with your connection string)
mongoose.connect(process.env.MONGODB_URI);

// When successfully connected
mongoose.connection.on("connected", () => {
  console.log("Connection to database established successfully");
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  console.error(`Error connecting to database: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected");
});

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// express middleware handling the body parsing
app.use(express.json());

// express middleware handling the form parsing
app.use(express.urlencoded({ extended: false }));

// Use user routes
app.use("/api/users", userRoutes);

// create static assets from react code for production only
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// use port from environment variables for production
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
