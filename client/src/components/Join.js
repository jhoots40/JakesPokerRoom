import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Join() {
  const [code, setCode] = useState();
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
    console.log(code);
    const username = Cookies.get("username");
    socket.emit("joinRoom", code, username);
    navigate("/chat");
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
            id="code"
            label="Code"
            variant="outlined"
            onChange={(e) => setCode(e.target.value)}
            autoComplete="username"
            error={false}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleClick}>
            Join Room
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Join;
