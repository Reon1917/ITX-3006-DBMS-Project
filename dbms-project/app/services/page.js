'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import Navbar from '@/components/Navbar';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data.services);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBooking = (serviceId) => {
    // TODO: Implement booking modal
    console.log('Booking service:', serviceId);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">Error: {error}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 6, fontWeight: 'bold', color: 'primary.main' }}
        >
          Our Services
        </Typography>

        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid item xs={12} md={4} key={service.SERVICE_ID}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardHeader
                  title={service.SERVICENAME}
                  subheader={`Duration: ${service.DURATION} minutes`}
                  action={
                    <Chip 
                      label={service.CATEGORY}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  }
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {service.DESCRIPTION}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2
                  }}>
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                      ${service.PRICE}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleBooking(service.SERVICE_ID)}
                    >
                      Book Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
} 