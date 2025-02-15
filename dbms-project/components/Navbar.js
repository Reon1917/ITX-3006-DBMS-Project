'use client';

import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Appointments', path: '/appointments' },
  ];

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              cursor: 'pointer',
              color: 'primary.main',
              fontWeight: 'bold'
            }}
            onClick={() => router.push('/')}
          >
            Glamour & Style
          </Typography>

          <div>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  mx: 1,
                  color: pathname === item.path ? 'primary.main' : 'text.primary',
                  fontWeight: pathname === item.path ? 'bold' : 'normal',
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 