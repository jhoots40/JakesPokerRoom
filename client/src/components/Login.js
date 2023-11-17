import React, { useState } from "react";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const data = {
      username: username,
      password: password,
    };

    axios
      .post("http://localhost:5000/api/users/login", data)
      .then((response) => {
        console.log(response.data);
        Cookies.set("username", data.username, { expires: 1 });

        navigate("/");
      })
      .catch((error) => {
        // Handle errors
        if (error.response) {
          // The server responded with a status code outside of the 2xx range
          console.error("Server Error:", error.response.data);
          setError("Invalid username or password");
        } else {
          // Something happened in setting up the request
          console.error("Error:", error.message);
        }
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          {error && (
            <Grid item>
              <Typography variant="p" color="error">
                {error}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              error={error !== ""}
            />
          </Grid>
          <Grid item>
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              error={error !== ""}
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained">
              Log In
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Login;
