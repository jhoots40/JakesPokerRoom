import React from "react";
import { Typography } from "@mui/material";
import { useTheme, Grid, Avatar } from "@mui/material";

const MessageBubble = ({ message }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      justifyContent="flex-start"
      flexWrap="wrap"
      alignItems="flex-start"
      sx={{ padding: "4px" }}
    >
      <>
        <Grid item>
          <Avatar sx={{ width: "21px", height: "21px" }}></Avatar>
        </Grid>
        <Grid item>
          <Typography
            sx={{ ml: "10px", fontWeight: "bold", fontSize: 13 }}
            color={
              message.mine
                ? theme.palette.secondary.main
                : theme.palette.primary.main
            }
          >
            {message.username + ":"}
          </Typography>
        </Grid>
        <Grid item sx={{ maxWidth: "80%" }}>
          <Typography
            sx={{ ml: "4px", wordWrap: "break-word", fontSize: 13 }}
            color={theme.palette.primary.contrastText}
          >
            {message.message}
          </Typography>
        </Grid>
      </>
    </Grid>
    // </Paper>
  );
};

export default MessageBubble;
