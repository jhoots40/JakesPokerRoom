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
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "150px",
                height: "150px",
                border: `2px solid black`,
                transform: "translate(-50%, -50%)",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    width: "70%",
                    height: "70%",
                    top: 0, // Set top to 0 to make the top of the box touch the top of the container
                    left: "50%",
                    transform: "translateX(-50%)", // Center the box horizontally
                    border: `2px solid green`,
                    zIndex: 1,
                }}
            ></Box>
            <Box
                sx={{
                    position: "absolute",
                    height: "40%",
                    width: "100%",
                    top: "60%", // Adjusted to position the box 70% away from the top of the outer box
                    border: `2px solid red`,
                    zIndex: 3,
                }}
            ></Box>
            <Box
                sx={{
                    position: "absolute",
                    height: "62.85%",
                    width: "45%",
                    bottom: "15%", // Adjusted to raise the box more in the middle
                    left: "5%", // Adjusted to position the box to the left
                    border: `2px solid blue`,
                    borderRadius: "10px",
                    zIndex: 2,
                    transform: "rotate(-3deg)", // Applied rotation for a slight tilt
                }}
            ></Box>
            <Box
                sx={{
                    position: "absolute",
                    height: "62.85%",
                    width: "45%",
                    bottom: "15%", // Adjusted to raise the box more in the middle
                    right: "5%", // Adjusted to position the box to the right
                    border: `2px solid blue`,
                    borderRadius: "10px",
                    zIndex: 2,
                    transform: "rotate(3deg)", // Applied rotation for a slight tilt
                }}
            ></Box>
        </Box>
    );
}

export default Join;
