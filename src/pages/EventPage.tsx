import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

export default function EventsPage() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Event Management
      </Typography>
      <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
        Add Event
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Sample Event</TableCell>
              <TableCell>Sample Description</TableCell>
              <TableCell>2025-03-01</TableCell>
              <TableCell>100</TableCell>
              <TableCell>
                <Button><Edit /></Button>
                <Button color="error"><Delete /></Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Evenвt</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" />
          <TextField label="Description" fullWidth margin="dense" />
          <TextField label="Date" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
          <TextField label="Price" type="number" fullWidth margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
