import React from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid
} from '@mui/material';

const AddEvent = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Events
      </Typography>
      
      <Paper style={{ padding: 16, marginBottom: 16 }}>
        <Typography variant="h6" gutterBottom>
          Add / Edit Event
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Description" fullWidth multiline rows={3} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Date" type="date" fullWidth InputLabelProps={{ shrink: true }} required />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Latitude" type="number" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Longitude" type="number" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Price" type="number" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Owner" fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Add Event
            </Button>
            <Button variant="outlined" color="secondary" style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper style={{ padding: 16 }}>
        <Typography variant="h5" gutterBottom>
          Events List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Coordinates</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AddEvent;
