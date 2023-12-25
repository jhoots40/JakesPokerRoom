import React from "react";
import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import "./test.css";
import { Button, Box } from "@mui/material";

function Room() {
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
      socket.on("gameUpdate", handleGameUpdate);
      socket.emit("joinRoom", roomCode, user.username, (response) => {
        if (!response.success) {
          alert("room doesn't exist");
          navigate("/");
        }
      });
      return () => {
        socket.emit("leaveRoom");
        socket.off("gameUpdate", handleGameUpdate);
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
    setTimer(data);
  };

  const handleJoinRoom = (data) => {
    console.log(data);
  };

  const handleLeaveRoom = (data) => {
    console.log(data);
  };

  const handleGameUpdate = (data) => {
    console.log(data);
  };

  const sendPost = () => {
    const action = {
      type: "post",
    };
    socket.emit("action", action);
  };

  const sendCheck = () => {
    const action = {
      type: "check",
    };
    socket.emit("action", action);
  };

  const sendRaise = () => {
    const action = {
      type: "raise",
    };
    socket.emit("action", action);
  };

  const sendCall = () => {
    const action = {
      type: "call",
    };
    socket.emit("action", action);
  };

  const sendFold = () => {
    const action = {
      type: "fold",
    };
    socket.emit("action", action);
  };

  const sendShow = () => {
    const action = {
      type: "show",
    };
    socket.emit("action", action);
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
          sx={{ m: 0.5 }}
          color="customDarkGrey"
          variant="contained"
          onClick={sendPost}
        >
          Post
        </Button>
        <Button
          sx={{ m: 0.5 }}
          color="customDarkGrey"
          variant="contained"
          onClick={sendCheck}
        >
          Check
        </Button>
        <Button
          sx={{ m: 0.5 }}
          color="customDarkGrey"
          variant="contained"
          onClick={sendRaise}
        >
          Raise
        </Button>
        <Button
          sx={{ m: 0.5 }}
          color="customDarkGrey"
          variant="contained"
          onClick={sendCall}
        >
          Call
        </Button>
        <Button
          sx={{ m: 0.5 }}
          color="customDarkGrey"
          variant="contained"
          onClick={sendFold}
        >
          Fold
        </Button>
        <Button
          sx={{ m: 0.5 }}
          color="customDarkGrey"
          variant="contained"
          onClick={sendShow}
        >
          Show
        </Button>
      </Box>
      <div className="chat">
        <ChatBox chatMessages={chatMessages}></ChatBox>
      </div>
    </div>
  );
}

export default Room;
