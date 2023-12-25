import React from "react";
import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import "./test.css";
import { Button, Box } from "@mui/material";

function Chat() {
  const [chatMessages, setChatMessages] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { roomCode } = useParams();
  const [userJoined, setUserJoined] = useState(false);
  const [timer, setTimer] = useState(60);

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
        setUser(response.data);
        setUserJoined(true);
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
      socket.on("timerUpdate", handleTimerUpdate);
      socket.emit("joinRoom", roomCode, user.username, (response) => {
        if (!response.success) {
          alert("room doesn't exist");
          navigate("/");
        }
      });
      return () => {
        socket.emit("leaveRoom");
        socket.off("timerUpdate", handleTimerUpdate);
        socket.off("userLeft", handleLeaveRoom);
        socket.off("userJoined", handleJoinRoom);
        socket.off("chatMessage", handleChatMessages);
      };
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userJoined, roomCode]);

  const handleChatMessages = (data) => {
    console.log(data);
    // Generate a unique key for the message
    const messageKey = new Date().toISOString(); // You can use a more sophisticated method if needed

    // Update the state to include the new message
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        key: messageKey,
        username: data.username,
        message: data.message,
        mine: data.username === user.username,
      },
    ]);
  };

  const handleTimerUpdate = (data) => {
    console.log(data);
    setTimer(data);
  };

  const handleJoinRoom = (data) => {
    console.log(data);
  };

  const handleLeaveRoom = (data) => {
    console.log(data);
  };

  const handleAction = () => {
    socket.emit("action", roomCode);
  };

  return (
    <div className="container">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <h1>{timer}</h1>
        <Button
          color="customDarkGrey"
          variant="contained"
          onClick={handleAction}
        >
          Reset
        </Button>
      </Box>
      <div className="chat">
        <ChatBox chatMessages={chatMessages}></ChatBox>
      </div>
    </div>
  );
}

export default Chat;
