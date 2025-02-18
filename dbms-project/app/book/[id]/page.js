'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useRouter } from 'next/navigation';

export default function BookingPage({ params }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: null,
    time: null,
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchService();
  }, [params.id]);

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${params.id}`);
      if (!response.ok) throw new Error('Service not found');
      const data = await response.json();
      setService(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!bookingData.date || !bookingData.time) {
      setError('Please select both date and time');
      return;
    }

    try {
      const startTime = new Date(bookingData.date);
      startTime.setHours(bookingData.time.getHours());
      startTime.setMinutes(bookingData.time.getMinutes());

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + service.DURATION);

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Service_ID: service.SERVICE_ID,
          AppointmentDate: startTime.toISOString().split('T')[0],
          StartTime: startTime.toISOString(),
          EndTime: endTime.toISOString(),
          CustomerName: bookingData.customerName,
          CustomerEmail: bookingData.customerEmail,
          CustomerPhone: bookingData.customerPhone
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to book appointment');
      }

      router.push('/appointments');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        <Button variant="contained" onClick={() => router.push('/services')}>
          Back to Services
        </Button>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>Service not found</Alert>
        <Button variant="contained" onClick={() => router.push('/services')}>
          Back to Services
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Book {service.SERVICENAME}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {service.DESCRIPTION}
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Service Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>Price: ${service.PRICE}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Duration: {service.DURATION} minutes</Typography>
            </Grid>
          </Grid>
        </Box>

        <form onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Select Date"
                  value={bookingData.date}
                  onChange={(newValue) => setBookingData({ ...bookingData, date: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  minDate={new Date()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Select Time"
                  value={bookingData.time}
                  onChange={(newValue) => setBookingData({ ...bookingData, time: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={bookingData.customerName}
                  onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={bookingData.customerEmail}
                  onChange={(e) => setBookingData({ ...bookingData, customerEmail: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={bookingData.customerPhone}
                  onChange={(e) => setBookingData({ ...bookingData, customerPhone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Book Appointment
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </form>
      </Paper>
    </Container>
  );
} 