import React from "react";
import { Box, Button } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
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
  }, [navigate]);

  const handleClick = () => {
    socket.emit("createRoom", user.username, (response) => {
      console.log(response);
    });
    navigate("/chat");
  };

  const handleJoin = () => {
    console.log(`${user.username} has went to the join room page`);
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
