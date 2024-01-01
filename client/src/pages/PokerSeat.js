import React from "react";
import { useEffect } from "react";
import { Box, Avatar, Paper, useTheme, Grid, Typography } from "@mui/material";
import PlayingCard from "./PlayingCard";

const PokerSeat = ({ gameState, color, name }) => {
    const theme = useTheme();
    useEffect(() => {
        //console.log("rendered seat component", name);
    }, []);

    function getCardString(index) {
        if (gameState && gameState.state === "betting") {
            let currentHoleCards = null;
            for (let i = 0; i < gameState.seats.length; i++) {
                if (name === gameState.seats[i].username) {
                    currentHoleCards = gameState.seats[i].holeCards;
                    break;
                }
            }
            console.log("retrieved hole card", currentHoleCards[index]);
            return currentHoleCards[index];
        } else return null;
    }

    if (gameState && name) {
        return (
            <>
                <Box
                    sx={{
                        position: "absolute",
                        width: "70%",
                        height: "70%",
                        top: 0, // Set top to 0 to make the top of the box touch the top of the container
                        left: "50%",
                        transform: "translateX(-50%)", // Center the box horizontally
                        //border: `2px solid green`,
                        zIndex: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            position: "relative",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: `${color ? "#0277bd" : ""}`,
                            color: "white",
                        }}
                    >
                        {null}
                    </Avatar>
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        height: "40%",
                        width: "100%",
                        top: "60%", // Adjusted to position the box 70% away from the top of the outer box
                        borderRadius: "15px",
                        zIndex: 3,
                    }}
                >
                    <Paper
                        sx={{
                            height: "100%",
                            width: "100%",
                            backgroundColor: theme.palette.customDarkGrey.main,
                        }}
                    >
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography
                                    color={
                                        theme.palette.customDarkGrey
                                            .contrastText
                                    }
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography
                                    color={
                                        theme.palette.customDarkGrey
                                            .contrastText
                                    }
                                >
                                    {name ? 0.0 : null}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        height: "62.85%",
                        width: "45%",
                        bottom: "15%", // Adjusted to raise the box more in the middle
                        left: "5%", // Adjusted to position the box to the left
                        zIndex: 2,
                        transform: "rotate(-3deg)", // Applied rotation for a slight tilt
                        overFlow: "hidden",
                    }}
                >
                    <PlayingCard cardString={getCardString(0)}></PlayingCard>
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        height: "62.85%",
                        width: "45%",
                        bottom: "15%", // Adjusted to raise the box more in the middle
                        right: "5%", // Adjusted to position the box to the right
                        zIndex: 2,
                        transform: "rotate(3deg)", // Applied rotation for a slight tilt
                    }}
                >
                    <PlayingCard cardString={getCardString(1)}></PlayingCard>
                </Box>
            </>
        );
    } else {
        return (
            <Avatar
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: "50%",
                    height: "50%",
                    bgcolor: `${color ? "#0277bd" : ""}`,
                    color: "white",
                    transform: "translate(50%, 50%)",
                }}
            >
                empty
            </Avatar>
        );
    }
};

export default PokerSeat;
