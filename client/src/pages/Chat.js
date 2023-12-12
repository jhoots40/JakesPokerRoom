import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Chat() {
  const [message, setMessage] = useState("");
  //const [chatMessages, setChatMessages] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { roomCode } = useParams();
  const [userJoined, setUserJoined] = useState(false);

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
  }, [navigate]);

  useEffect(() => {
    // If userJoined is true, emit "joinRoom" and set up cleanup for "leaveRoom"
    if (userJoined) {
      socket.on("chatMessage", handleChatMessages);
      socket.on("userJoined", handleJoinRoom);
      socket.on("userLeft", handleLeaveRoom);
      socket.emit("joinRoom", roomCode, user.username, (response) => {
        if (!response.success) {
          alert("room doesn't exist");
          navigate("/");
        }
      });
      return () => {
        socket.emit("leaveRoom");
        socket.off("userLeft", handleLeaveRoom);
        socket.off("userJoined", handleJoinRoom);
        socket.off("chatMessage", handleChatMessages);
      };
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userJoined, roomCode]);

  const handleClick = () => {
    socket.emit("chatMessage", message);
    setMessage("");
  };

  const handleChatMessages = (data) => {
    console.log(data);
    //setChatMessages((prevMessages) => [...prevMessages, data]);
  };

  const handleJoinRoom = (data) => {
    console.log("made it here");
    console.log(data);
  };

  const handleLeaveRoom = (data) => {
    console.log("made it here 2");
    console.log(data);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
      sx={{ backgroundColor: "rgb(70, 70, 70)" }}
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
