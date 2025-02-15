'use client';

import { useState } from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '@/components/Navbar';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

export default function Home() {
  const [featuredServices] = useState([
    {
      title: 'Bridal Makeup',
      description: 'Complete bridal makeup package including trial session',
      price: '$250'
    },
    {
      title: 'Cosplay Makeup',
      description: 'Professional character transformation for cosplayers',
      price: '$150'
    },
    {
      title: 'Special Effects',
      description: 'Theatrical and special effects makeup for events',
      price: '$200'
    }
  ]);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ my: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 6
            }}
          >
            Glamour & Style Studio
          </Typography>

          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 8 }}
          >
            Professional makeup services for all occasions - from bridal to cosplay transformations
          </Typography>

          <Grid container spacing={4}>
            {featuredServices.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Item>
                  <Typography variant="h5" component="h2" gutterBottom color="primary">
                    {service.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {service.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {service.price}
                  </Typography>
                </Item>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 12, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="primary">
              Why Choose Us?
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Professional Artists
                </Typography>
                <Typography variant="body1">
                  Experienced makeup artists specializing in various styles
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Quality Products
                </Typography>
                <Typography variant="body1">
                  We use high-end, long-lasting makeup products
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Flexible Booking
                </Typography>
                <Typography variant="body1">
                  Easy online booking system with flexible scheduling
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
