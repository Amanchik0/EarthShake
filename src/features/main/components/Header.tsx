import React, { Component } from 'react'
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
export default class Header extends Component {
  render() {
    return (
              <AppBar position="static" sx={{ backgroundColor: "#f8d7da", color: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Cityvora</Typography>
          <Box>
            <Button color="inherit" sx={{ textTransform: "none" }}>Home</Button>
            <Button color="inherit" sx={{ textTransform: "none" }}>Guidelines</Button>
            <Button color="inherit" sx={{ textTransform: "none" }}>News</Button>
            <Button color="inherit" sx={{ textTransform: "none" }}>Emergency Map</Button>
            <Button color="inherit" sx={{ textTransform: "none" }}>Support</Button>
            <NotificationsIcon sx={{ mx: 2 }} />
            <AccountCircleIcon />
          </Box>
        </Toolbar>
      </AppBar>
      
    )
  }
}
