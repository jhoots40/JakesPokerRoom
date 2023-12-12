import React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    id: "entryCode",
    label: "Code",
    minWidth: "33.3333%",
    align: "left",
    color: "rgb(186, 137, 86)",
  },
  {
    id: "users",
    label: "# Users",
    minWidth: "33.3333%",
    align: "left",
    color: "rgb(188, 44, 42)",
  },
  {
    id: "Button",
    label: "",
    minWidth: "33.33333%",
    align: "left",
    color: "rgb(77, 110, 208)",
  },
];

function RoomList() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [roomsLoaded, setRoomsLoaded] = useState(false);

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
        console.log(response.data);
        setUser(response.data);
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

    axios
      .get("http://localhost:5000/api/rooms/get-all", config)
      .then((response) => {
        console.log(response.data);
        setRooms(response.data);
        setRoomsLoaded(true);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.log("Error", error);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (roomsLoaded) {
      //todo: populate the table/load values into the table
    }
  }, [roomsLoaded]);

  const handleClick = (entryCode) => {
    navigate(`/chat/${entryCode}`);
    //console.count(entryCode);
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh", backgroundColor: "rgb(70, 70, 70)" }}
      >
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: "440px" }}>
                <Table stickyHeader size="small" aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align="center"
                          style={{
                            minWidth: column.minWidth,
                            color: column.color,
                            fontWeight: "bold",
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rooms.map((val) => (
                      <TableRow
                        key={val.entryCode}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{val.entryCode}</TableCell>
                        <TableCell align="center">
                          {val.players.length}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            color="customDarkGrey"
                            variant="contained"
                            size="small"
                            onClick={() => handleClick(val.entryCode)}
                          >
                            Join Room
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item>
            <Button color="customDarkGrey" variant="contained">
              Fetch Rooms
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default RoomList;
