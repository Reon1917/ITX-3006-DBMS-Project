'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" minHeight="60vh">
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          <Button variant="contained" onClick={fetchServices}>Retry</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Our Services
      </Typography>

      <Grid container spacing={4}>
        {services && services.map((service) => (
          <Grid item xs={12} md={4} key={service.SERVICE_ID}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {service.SERVICENAME}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.DESCRIPTION}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${service.PRICE}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {service.DURATION} minutes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {service.CATEGORY}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained" 
                  fullWidth
                  onClick={() => router.push(`/appointments/book?serviceId=${service.SERVICE_ID}`)}
                >
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {services.length === 0 && !loading && !error && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="h6" color="text.secondary">
            No services available at the moment.
          </Typography>
        </Box>
      )}
    </Container>
  );
} 