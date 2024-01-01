import React from "react";
import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import "./test.css";
import { Button, Box, Grid, Typography, Avatar } from "@mui/material";
import PokerSeat from "./PokerSeat";

const seats = [
    { id: 0, top: "75%", left: "50%" },
    { id: 1, top: "65%", left: "85%" },
    { id: 2, top: "20%", left: "85%" },
    { id: 3, top: "10%", left: "50%" },
    { id: 4, top: "20%", left: "15%" },
    { id: 5, top: "65%", left: "15%" },
];

const actionInMemory = [
    { id: 0, type: "post" },
    { id: 1, type: "check" },
    { id: 2, type: "raise" },
    { id: 3, type: "call" },
    { id: 4, type: "fold" },
    { id: 5, type: "show" },
    { id: 6, type: "ready" },
];

function Room() {
    const [chatMessages, setChatMessages] = useState([]);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { roomCode } = useParams();
    const [userJoined, setUserJoined] = useState(false);
    const [timer, setTimer] = useState(15);
    const [gameState, setGameState] = useState(null);
    const [seat, setSeat] = useState(-1);

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
                setUser(response.data);
                setUserJoined(true);
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

    useEffect(() => {
        // If userJoined is true, emit "joinRoom" and set up cleanup for "leaveRoom"
        if (userJoined) {
            socket.on("chatMessage", handleChatMessages);
            socket.on("userJoined", handleJoinRoom);
            socket.on("userLeft", handleLeaveRoom);
            socket.on("timerUpdate", handleTimerUpdate);
            socket.on("gameUpdate", handleGameUpdate);
            socket.emit("joinRoom", roomCode, user.username, (response) => {
                if (!response.success) {
                    alert("room doesn't exist");
                    navigate("/");
                } else {
                    setSeat(response.seat);
                }
            });
            return () => {
                socket.emit("leaveRoom", roomCode);
                socket.off("gameUpdate", handleGameUpdate);
                socket.off("timerUpdate", handleTimerUpdate);
                socket.off("userLeft", handleLeaveRoom);
                socket.off("userJoined", handleJoinRoom);
                socket.off("chatMessage", handleChatMessages);
            };
        }

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userJoined, roomCode]);

    useEffect(() => {
        if (gameState) {
            console.log("Logging Game State: ", gameState);

            if (gameState.activeRound.turn === seat) {
                //console.log("IT IS YOUR TURN!!");
            } else {
                // console.log("Please wait for your turn");
            }
        }
    }, [gameState]);

    const handleChatMessages = (data) => {
        console.log(data);
        // Generate a unique key for the message
        const messageKey = new Date().toISOString(); // You can use a more sophisticated method if needed

        // Update the state to include the new message
        setChatMessages((prevMessages) => [
            ...prevMessages,
            {
                key: messageKey,
                username: data.username,
                message: data.message,
                mine: data.username === user.username,
            },
        ]);
    };

    const handleTimerUpdate = (data) => {
        //console.count();
        setTimer(data);
    };

    const handleJoinRoom = (data) => {
        console.log(data.message);
        setGameState(data.gameObject);
    };

    const handleLeaveRoom = (data) => {
        console.log(data.message);
        setGameState(data.gameObject);
    };

    const handleGameUpdate = (data) => {
        setGameState(data);
    };

    const sendAction = (actionType) => {
        const action = {
            type: actionType,
            seatId: seat,
        };
        socket.emit("action", action, roomCode);
    };

    const renderContent = () => {
        if (gameState) {
            if (gameState.state === "ready") {
                return (
                    <Button
                        sx={{ m: 0.5 }}
                        color="customDarkGrey"
                        variant="contained"
                        onClick={() => sendAction("ready")}
                    >
                        Ready!
                    </Button>
                );
            } else if (gameState.state === "dealing") {
                return <></>;
            } else {
                return actionInMemory.map((b) => (
                    <Button
                        key={b.id}
                        sx={{ m: 0.5 }}
                        color="customDarkGrey"
                        variant="contained"
                        onClick={() => sendAction(b.type)}
                        disabled={
                            gameState.activeRound.turn === seat ? false : true
                        }
                    >
                        {b.type}
                    </Button>
                ));
            }
        } else {
            return <p>loading...</p>;
        }
    };

    function renderStateName() {
        if (gameState) {
            return <h1>{gameState.state}</h1>;
        } else return;
    }

    function renderSeats() {
        return seats.map((s) => {
            const seatState = gameState?.seats[s.id];
            const isReady = gameState?.state === "ready";
            const isActiveTurn = gameState?.activeRound.turn === s.id;
            const seatBorderColor = gameState?.seats[s.id].username
                ? "solid"
                : "";
            const seatColor = gameState
                ? isReady
                    ? seatState.ready
                        ? "blue"
                        : "black"
                    : isActiveTurn
                      ? "green"
                      : "black"
                : "";
            const seatName = gameState?.seats[s.id]?.username || null;
            const avatarColor = s.id === seat;

            return (
                <Box
                    key={s.id}
                    sx={{
                        position: "absolute",
                        width: "150px",
                        height: "150px",
                        border: `5px ${seatBorderColor} ${seatColor}`,
                        transform: "translate(-50%, -50%)",
                        top: s.top,
                        left: s.left,
                    }}
                >
                    <PokerSeat
                        gameState={gameState}
                        color={avatarColor}
                        name={seatName}
                        seat={seat}
                    />
                </Box>
            );
        });
    }

    const sendPost = () => {};

    const sendCheck = () => {};

    const sendRaise = () => {};

    const sendCall = () => {};

    const sendFold = () => {};

    const sendShow = () => {};

    return (
        <div className="container">
            {renderSeats()}
            <Grid
                container
                direction="column"
                alignItems="center"
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                }}
            >
                <Grid
                    container
                    item
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        width: "100%",
                        height: "80%",
                        border: 1,
                        borderColor: "green",
                    }}
                >
                    {renderStateName()}
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    item
                    sx={{ width: "100%", height: "20%" }}
                >
                    <Grid
                        container
                        item
                        sx={{
                            position: "relative",
                            width: "30%",
                            height: "100%",
                        }}
                    >
                        <ChatBox chatMessages={chatMessages}></ChatBox>
                    </Grid>

                    <Grid
                        container
                        item
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            width: "70%",
                            height: "100%",
                        }}
                    >
                        <Typography variant="h2" sx={{ textAlign: "center" }}>
                            {timer}
                        </Typography>
                        <Grid
                            container
                            item
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {renderContent()}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Room;
