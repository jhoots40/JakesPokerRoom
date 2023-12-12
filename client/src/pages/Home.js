import React from "react";
import { Box, Button, Grid, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
  }, [navigate]);

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

  const handleRooms = () => {
    navigate("/rooms");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh", backgroundColor: "rgb(70, 70, 70)" }}
    >
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Avatar
            sx={{
              bgcolor: "#0277bd",
              borderColor: "#141414 !important",
              border: 5,
              width: 100,
              height: 100,
            }}
          >{`${user?.username}`}</Avatar>
        </Grid>
        <Grid item>
          <Button
            color="customDarkGrey"
            variant="contained"
            onClick={handleRooms}
          >
            Active Rooms
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="customDarkGrey"
            variant="contained"
            onClick={handleClick}
          >
            Create
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="customDarkGrey"
            variant="contained"
            onClick={handleJoin}
          >
            Join Room
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
