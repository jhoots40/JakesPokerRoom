import React from "react";
import { Box, Button } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const runItOnce = useRef(true);

  /*useEffect(() => {


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
          if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
          ) {
            // Redirect to login page if not authenticated
            navigate("/login");
          } else {
            // Handle other errors
            console.error("Error fetching user data:", error.message);
          }
        });
    };
    if (runItOnce.current) {
      runItOnce.current = false;
      fetchUserData();
    }
  }, []);*/

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
        console.log(response.data);
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

  const handleClick = () => {
    socket.emit("createRoom", (response) => {
      if (response.success) {
        navigate(`/chat/${response.entryCode}`);
      } else {
        console.error("Error creating room:", response.error);
      }
    });
  };

  const handleJoin = () => {
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
