'use client';

import { Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Glamour & Style Studio
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" mb={4}>
          Professional makeup services for all occasions - from bridal to cosplay transformations
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome to our premier makeup studio where artistry meets transformation. 
          Whether you&apos;re preparing for your special day, stepping into character, 
          or seeking a stunning look for any occasion, our expert team is here to bring your vision to life.
        </Typography>
      </Box>
    </Container>
  );
}
