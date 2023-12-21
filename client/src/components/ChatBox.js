import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import socket from "../utils/socket";
import ChatMessage from "./ChatMessage";

const ChatBox = ({ chatMessages }) => {
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const containerRef = useRef();

  const handleClick = () => {
    if (message === "" || message === null) return;
    socket.emit("chatMessage", message);
    setMessage("");
  };

  useEffect(() => {
    // Scroll to the bottom when chatMessages change
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [chatMessages]);

  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.customDarkGrey.main,
        padding: "15px",
        width: "600px",
        height: "600px",
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        alignItems="center"
        sx={{
          //   border: 1,
          //   borderColor: "#ffffff",
          height: "100%",
        }}
      >
        <Grid
          item
          container
          direction="column"
          justifyContent="flex-start"
          sx={{
            // border: 1,
            // borderColor: "#ff0000",
            maxHeight: `calc(100% - 45px)`,
            overflowY: "auto",
            flexWrap: "nowrap", // Add this line
          }}
          ref={containerRef}
        >
          {chatMessages.map((m) => (
            <Grid item container key={m.key}>
              <ChatMessage message={m} />
            </Grid>
          ))}
        </Grid>
        <Grid
          item
          container
          sx={{ pt: "5px" }}
          display="row"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <TextField
            id="message"
            label="Message"
            variant="outlined"
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
            error={false}
            value={message}
            focused
            color="primary"
            size="small"
            sx={{
              width: "80%",
              minWidth: "320px",
              "& input": { color: "white" },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            size="small"
            sx={{
              width: "18%",
            }}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ChatBox;
