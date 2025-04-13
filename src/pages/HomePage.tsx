import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import KazakhstanMap from "../pages/EmergencyMapPage";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RoomIcon from "@mui/icons-material/Room";
import WarningIcon from "@mui/icons-material/Warning";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const HomePage: React.FC = () => {
  return (
    <Container sx={{ mt: 5 }}>
      {/* Hero Section */}
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6} textAlign="center">
          <Typography variant="h4" fontWeight={600}>
            Your reliable assistant in emergency situations
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2, color: "gray" }}>
            PROJECT DESCRIPTION
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#d9534f",
              "&:hover": { backgroundColor: "#c9302c" },
              px: 4,
            }}
          >
            Download the App
          </Button>
          <Typography variant="body2" sx={{ mt: 1 }}>
            ANDROID | IOS
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
          <KazakhstanMap />
        </Grid>
      </Grid>

      {/* Description Section */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h5" fontWeight={600}>
          Cityvora
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "gray" }}>
          "absorption" of all city news and events.
        </Typography>
      </Box>

      {/* Feature Grid */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              backgroundColor: "#fdeaea",
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              boxShadow: 2,
              height: "100%",
            }}
          >
            <NotificationsIcon fontSize="large" />
            <Typography variant="h6" fontWeight={500} mt={1}>
              LATEST ALERTS
            </Typography>
            <Typography variant="body2" mt={1}>
              Real-time notifications of emergencies.
            </Typography>
            <Button variant="text" sx={{ mt: 1 }}>
              View more
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              backgroundColor: "#fdeaea",
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              boxShadow: 2,
              height: "100%",
            }}
          >
            <RoomIcon fontSize="large" />
            <Typography variant="h6" fontWeight={500} mt={1}>
              EMERGENCY MAP
            </Typography>
            <Typography variant="body2" mt={1}>
              Interactive map of incidents.
            </Typography>
            <Button variant="text" sx={{ mt: 1 }}>
              Explore map
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              backgroundColor: "#fdeaea",
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              boxShadow: 2,
              height: "100%",
            }}
          >
            <WarningIcon fontSize="large" />
            <Typography variant="h6" fontWeight={500} mt={1}>
              GUIDELINES
            </Typography>
            <Typography variant="body2" mt={1}>
              Safety tips for emergencies.
            </Typography>
            <Button variant="text" sx={{ mt: 1 }}>
              Read more
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              backgroundColor: "#fdeaea",
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              boxShadow: 2,
              height: "100%",
            }}
          >
            <SupportAgentIcon fontSize="large" />
            <Typography variant="h6" fontWeight={500} mt={1}>
              SUPPORT
            </Typography>
            <Typography variant="body2" mt={1}>
              Contact us for assistance.
            </Typography>
            <Button variant="text" sx={{ mt: 1 }}>
              Get help
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
