import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";

function Join() {
  const [code, setCode] = useState();
  const navigate = useNavigate();

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
