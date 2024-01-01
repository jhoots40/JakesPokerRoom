import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./pokerCard.css";

function Join() {
    const [code, setCode] = useState();
    const navigate = useNavigate();
    const [isFlipped, setIsFlipped] = useState(false);

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };
    //const [user, setUser] = useState(null);

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
                //setUser(response.data);
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
        navigate(`/room/${code}`);
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ height: "100vh" }}
        >
            {/* <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <TextField
            id="code"
            label="Code"
            variant="outlined"
            onChange={(e) => setCode(e.target.value)}
            autoComplete="username"
            error={false}
            type="number"
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleClick}>
            Join Room
          </Button>
        </Grid>
      </Grid> */}
            <div className="deal">
                {/* Your deal content goes here */}
                <p>Your deal content</p>
            </div>
        </Box>
    );
}

export default Join;
