'use client';

import { AppBar, Toolbar, Typography, Button, Container, Switch, FormControlLabel } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Appointments', path: '/appointments' },
  ];

  // Add admin-specific nav items
  const adminItems = isAdmin ? [
    { label: 'Manage Services', path: '/admin/services' },
    { label: 'Manage Employees', path: '/admin/employees' },
  ] : [];

  const allNavItems = [...navItems, ...adminItems];

  const handleRoleSwitch = (event) => {
    setIsAdmin(event.target.checked);
    // Redirect to home when switching roles
    router.push('/');
  };

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

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {allNavItems.map((item) => (
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
            <FormControlLabel
              control={
                <Switch
                  checked={isAdmin}
                  onChange={handleRoleSwitch}
                  color="primary"
                />
              }
              label={isAdmin ? "Admin Mode" : "User Mode"}
              sx={{ ml: 2 }}
            />
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 