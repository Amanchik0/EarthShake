import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const LandingPage: React.FC = () => {
  return (
    <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 5 }}>
      {/* Text Section */}
      <Box sx={{ flex: 1, textAlign: "center", padding: "20px" }}>
        <Typography variant="h4" fontWeight={600}>
          Your reliable assistant in emergency situations
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2, color: "gray" }}>
          PROJECT DESCRIPTION
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3, backgroundColor: "#d9534f", "&:hover": { backgroundColor: "#c9302c" } }}
        >
          Download the App
        </Button>
        <Typography variant="body2" sx={{ mt: 1 }}>ANDROID | IOS</Typography>
      </Box>

      {/* Interactive Image Section */}
      <Box
        sx={{
          flex: 1,
          height: "400px",
          backgroundImage: "url('https://hatber.kz/upload/iblock/8a1/8a1a1d80724a7a9bb3f611f60a582be3.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "10px",
          transition: "transform 0.3s ease-in-out",
          '&:hover': {
            transform: "scale(1.05)",
          },
        }}
      />
    </Container>
  );
};

export default LandingPage;
