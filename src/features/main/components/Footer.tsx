import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "#fdeaea", mt: 6, py: 4 }}>
      <Container sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#d9534f",
            "&:hover": { backgroundColor: "#c9302c" },
            px: 5,
            mb: 3,
          }}
        >
          LOAD MORE...
        </Button>

        <Typography variant="body2" color="textSecondary">
          Developed by Cityvora Team | Contact:{" "}
          <a href="mailto:support@cityvora.com" style={{ color: "#333" }}>
            support@cityvora.com
          </a>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
