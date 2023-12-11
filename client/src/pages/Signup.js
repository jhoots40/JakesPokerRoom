import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography, TextField, Button, Link } from "@mui/material";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => {
    // Simple email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    setError("");
    setEmailError(false);
    setPasswordError(false);
    setUsernameError(false);
    e.preventDefault(); // Prevent the default form submission behavior

    if (!isPasswordValid(password)) {
      setError(
        "Password Requirements\n* 8 Characters\n* 1 uppercase letter\n* 1 lowercase letter\n* 1 symbol"
      );
      setPasswordError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setError("Invalid Email");
      setEmailError(true);
      return;
    }

    if (confirm !== password) {
      setError("Passwords do not match");
      setPasswordError(true);
      return;
    }

    const data = {
      username: username,
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:5000/api/users/register", data)
      .then((response) => {
        console.log(response.data);

        navigate("/");
      })
      .catch((error) => {
        // Handle errors
        if (error.response) {
          // The server responded with a status code outside of the 2xx range
          console.error("Server Error:", error.response.data);
          const message = error.response.data.error;
          if (message === "Username is already taken") setUsernameError(true);
          if (message === "Email is already in use") setEmailError(true);
          setError(error.response.data.error);
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
      sx={{ backgroundColor: "rgb(70, 70, 70)" }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h1" color="#141414">
              Dev Dialogue
            </Typography>
          </Grid>
          <Grid item sx={{ mb: 2 }}>
            <Typography variant="span" color="#141414">
              Already have an account?&ensp;
            </Typography>
            <Link href="/login" variant="span" color="secondary">
              Log in here!
            </Link>
          </Grid>
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
              error={usernameError}
              color="customDarkGrey"
              focused
            />
          </Grid>
          <Grid item>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              error={emailError}
              color="customDarkGrey"
              focused
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
              error={passwordError}
              color="customDarkGrey"
              focused
            />
          </Grid>
          <Grid item>
            <TextField
              id="confirm"
              label="Confirm Password"
              type="password"
              variant="outlined"
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="current-confirm"
              error={passwordError}
              color="customDarkGrey"
              focused
            />
          </Grid>
          <Grid item sx={{ mt: 1 }}>
            <Button type="submit" variant="contained" color="customDarkGrey">
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Signup;
