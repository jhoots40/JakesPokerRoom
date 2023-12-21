import React from "react";
import { Paper, Typography } from "@mui/material";
import { useTheme, Grid, Avatar } from "@mui/material";

const MessageBubble = ({ message }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      justifyContent={message.mine ? "flex-end" : "flex-start"}
      flexWrap="wrap"
      alignItems="flex-end"
      sx={{ padding: 1 }}
    >
      {!message.mine ? (
        <>
          <Grid item>
            <Avatar sx={{ width: "30px", height: "30px" }}></Avatar>
          </Grid>
          <Grid item>
            <Typography sx={{ ml: "10px" }} color={theme.palette.primary.main}>
              {message.username + ":"}
            </Typography>
          </Grid>
          <Grid item sx={{ maxWidth: "60%" }}>
            <Typography
              sx={{ ml: "4px", wordWrap: "break-word" }}
              color={theme.palette.primary.contrastText}
            >
              {message.message}
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          <Grid item sx={{ maxWidth: "60%" }}>
            <Typography
              sx={{
                mr: "10px",
                fontWeight: "bold",
                wordWrap: "break-word",
              }}
              color={theme.palette.secondary.main}
            >
              {message.message}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar sx={{ width: "30px", height: "30px" }}></Avatar>
          </Grid>
        </>
      )}
    </Grid>
    // </Paper>
  );
};

export default MessageBubble;
