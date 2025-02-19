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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

const categories = ['Bridal', 'Cosplay', 'Special Effects', 'Events'];

export default function AdminServices() {
  const router = useRouter();
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
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  };

  const handleOpen = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        ServiceName: service.SERVICENAME || '',
        Description: service.DESCRIPTION || '',
        Price: service.PRICE?.toString() || '',
        Duration: service.DURATION?.toString() || '',
        Category: service.CATEGORY || '',
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
        ? `/api/services/${editingService.SERVICE_ID}`
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
        const errorData = await response.json();
        console.error('Error saving service:', errorData);
        alert(errorData.error || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
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
          const errorData = await response.json();
          alert(errorData.error || 'Failed to delete service');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Button
          onClick={() => router.back()}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'primary.light',
            },
          }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
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
            {services && services.map((service) => (
              <TableRow key={service.SERVICE_ID}>
                <TableCell>{service.SERVICENAME}</TableCell>
                <TableCell>{service.DESCRIPTION}</TableCell>
                <TableCell>${service.PRICE}</TableCell>
                <TableCell>{service.DURATION}</TableCell>
                <TableCell>{service.CATEGORY}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(service)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(service.SERVICE_ID)} color="error">
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
            required
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
            required
          />
          <TextField
            name="Duration"
            label="Duration (minutes)"
            value={formData.Duration}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
            required
          />
          <TextField
            name="Category"
            label="Category"
            value={formData.Category}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            select
            required
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
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.ServiceName || !formData.Price || !formData.Duration || !formData.Category}
          >
            {editingService ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 