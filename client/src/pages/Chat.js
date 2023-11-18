import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Chat() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { roomCode } = useParams();
  const runItOnce = useRef(false);

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  useEffect(() => {
    // Connect to the socket when the component mounts
    socket.connect();

    // Set the socket connection status in the state
    setIsSocketConnected(true);

    // Add the event listener
    socket.on("chatMessage", handleChatMessages);

    // Disconnect from the socket when the component unmounts
    return () => {
      socket.off("chatMessage", handleChatMessages);
      socket.disconnect();
      setIsSocketConnected(false);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/get-info",
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setUser(response.data);
          socket.emit("joinRoom", roomCode, response.data.username);
        } else {
          console.error("Error fetching user data:", response.statusText);
        }
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          navigate("/login");
        } else {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    // Run only once the socket is connected
    if (isSocketConnected) {
      // Connect to the socket when entering the game room page
      socket.connect();

      fetchUserData();

      // Add the event listener
      socket.on("chatMessage", handleChatMessages);

      // Set the runItOnce ref to true
      runItOnce.current = true;
    }

    // Cleanup function (disconnect socket when the component is unmounted)
    return () => {
      socket.off("chatMessage", handleChatMessages);
    };
  }, [isSocketConnected]); // Empty dependencies array to run this effect only once on mount

  const handleClick = () => {
    socket.emit("chatMessage", message, user.username, roomCode);
    setMessage("");
  };

  const handleChatMessages = (data) => {
    console.log(data);
    setChatMessages((prevMessages) => [...prevMessages, data]);
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
