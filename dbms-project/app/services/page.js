'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Glamour & Style Studio
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" mb={4}>
          Professional makeup services for all occasions - from bridal to cosplay transformations
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {Array.isArray(services) && services.map((service) => (
          <Grid item xs={12} md={4} key={service.SERVICE_ID}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <Typography variant="h5" component="h2" color="primary" gutterBottom>
                    {service.SERVICENAME}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {service.DESCRIPTION}
                  </Typography>
                </div>
                <div>
                  <Typography variant="h4" color="primary" gutterBottom>
                    ${service.PRICE}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Duration: {service.DURATION} minutes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Category: {service.CATEGORY}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => router.push(`/book/${service.SERVICE_ID}`)}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 