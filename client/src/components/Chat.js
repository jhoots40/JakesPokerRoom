import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Chat() {
  const [message, setMessage] = useState("");
  const [prevMessages, setMessages] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      axios
        .get("http://localhost:5000/api/users/get-info", {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) {
            setUser(response.data);
          } else {
            // Handle other status codes
            console.error("Error fetching user data:", response.statusText);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            // Redirect to login page if not authenticated
            navigate("/login");
          } else {
            // Handle other errors
            console.error("Error fetching user data:", error.message);
          }
        });
    };

    fetchUserData();

    // Listen for chat messages from the server
    socket.on("chatMessage", (receivedMessage) => {
      // Update the messages state with the received message
      console.log(prevMessages);
      console.log(receivedMessage);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("chatMessage");
    };
  }, [navigate]);

  const handleClick = () => {
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
