'use client';

import { useState, useEffect } from 'react';
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
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const categories = ['Bridal', 'Cosplay', 'Special Effects', 'Events'];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    ServiceName: '',
    Description: '',
    Price: '',
    Duration: '',
    Category: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleOpen = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        ServiceName: service.ServiceName,
        Description: service.Description,
        Price: service.Price.toString(),
        Duration: service.Duration.toString(),
        Category: service.Category,
      });
    } else {
      setEditingService(null);
      setFormData({
        ServiceName: '',
        Description: '',
        Price: '',
        Duration: '',
        Category: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingService(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const method = editingService ? 'PUT' : 'POST';
      const url = editingService 
        ? `/api/services/${editingService.Service_ID}`
        : '/api/services';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          Price: parseFloat(formData.Price),
          Duration: parseInt(formData.Duration),
        }),
      });

      if (response.ok) {
        handleClose();
        fetchServices();
      } else {
        console.error('Error saving service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`/api/services/${serviceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchServices();
        } else {
          console.error('Error deleting service');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Manage Services
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Add New Service
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration (min)</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.Service_ID}>
                <TableCell>{service.ServiceName}</TableCell>
                <TableCell>{service.Description}</TableCell>
                <TableCell>${service.Price}</TableCell>
                <TableCell>{service.Duration}</TableCell>
                <TableCell>{service.Category}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(service)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(service.Service_ID)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="ServiceName"
            label="Service Name"
            value={formData.ServiceName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="Description"
            label="Description"
            value={formData.Description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            name="Price"
            label="Price"
            value={formData.Price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="Duration"
            label="Duration (minutes)"
            value={formData.Duration}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="Category"
            label="Category"
            value={formData.Category}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            select
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingService ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 