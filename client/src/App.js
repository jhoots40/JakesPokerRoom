import React from "react";
import "./styles/App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Join from "./pages/Join";
import RoomList from "./pages/RoomList";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#707070",
    },
    secondary: {
      main: "#0277bd",
    },
    customDarkGrey: {
      main: "#141414",
    },
  },
});

theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    customDarkGrey: theme.palette.augmentColor({
      color: {
        main: "#141414",
      },
      name: "customDarkGrey",
    }),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/chat/:roomCode" element={<Chat />} />
        <Route path="/join" element={<Join />} />
        <Route path="/rooms" element={<RoomList />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
