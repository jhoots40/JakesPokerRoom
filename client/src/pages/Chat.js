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
  const [userJoined, setUserJoined] = useState(false);
  const runItOnce = useRef(true);

  /*useEffect(() => {
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
          setUserJoined(true);
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

    // Run once when component mounts
    if (runItOnce.current) {
      fetchUserData();
      runItOnce.current = false;
    }

    // If userJoined is true, emit "joinRoom" and set up cleanup for "leaveRoom"
    if (userJoined) {
      socket.on("chatMessage", handleChatMessages);
      socket.emit("joinRoom", roomCode, user.username);
      return () => {
        socket.off("chatMessage", handleChatMessages);
        socket.emit("leaveRoom");
      };
    }

    // If userJoined is false, return a cleanup function that does nothing
    return () => {};
  }, [userJoined]); */

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const config = {
      withCredentials: true,
      signal,
    };

    axios
      .get("http://localhost:5000/api/users/get-info", config)
      .then((response) => {
        setUserJoined(true);
        setUser(response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else if (
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          navigate("/login");
        } else {
          console.error("Error:", error);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    // If userJoined is true, emit "joinRoom" and set up cleanup for "leaveRoom"
    if (userJoined) {
      socket.on("chatMessage", handleChatMessages);
      socket.emit("joinRoom", roomCode, user.username);
      return () => {
        socket.off("chatMessage", handleChatMessages);
        socket.emit("leaveRoom");
      };
    }

    return () => {};
  }, [userJoined]);

  const handleClick = () => {
    socket.emit("chatMessage", message);
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
