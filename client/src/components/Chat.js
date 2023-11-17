import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import socket from "./socket";

function Chat() {
  const [message, setMessage] = useState("");
  const [prevMessages, setMessages] = useState([]);
  useEffect(() => {
    // Listen for chat messages from the server
    socket.on("chatMessage", (receivedMessage) => {
      // Update the messages state with the received message
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const handleClick = () => {
    console.log("made it here");
    socket.emit("chatMessage", message);
    setMessage("");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <TextField
            id="message"
            label="Message"
            variant="outlined"
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="username"
            error={false}
            value={message}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleClick}>
            Send Message
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Chat;
