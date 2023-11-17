import React from "react";
import { Box, Button } from "@mui/material";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    const username = Cookies.get("username");
    console.log(username);
    socket.emit("createRoom", username, (response) => {
      console.log(response);
    });
    navigate("/chat");
  };

  const handleJoin = () => {
    const username = Cookies.get("username");
    console.log(`${username} has went to the join room page`);
    navigate("/join");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Button variant="contained" onClick={handleClick}>
        Create Room
      </Button>
      <Button variant="contained" onClick={handleJoin}>
        Join Room
      </Button>
    </Box>
  );
}

export default Home;
