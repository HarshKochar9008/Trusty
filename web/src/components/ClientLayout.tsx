'use client'

import * as React from 'react';
import Link from 'next/link';
import { AppBar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { WalletConnect } from './WalletConnect';
import { StarsBackground } from './core/backgrounds/stars';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);

  const openMobileMenu = (event: React.MouseEvent<HTMLElement>) => setMobileMenuAnchor(event.currentTarget);
  const closeMobileMenu = () => setMobileMenuAnchor(null);

  return (
    <StarsBackground className="min-h-screen min-h-[100dvh] flex flex-col">
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          borderBottom: 'none',
          zIndex: 1000,
          padding: { xs: '10px 0', md: '16px 0' }
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 0 } }}>
          <Box sx={{
            backgroundColor: 'rgba(40, 40, 40, 0.35)',
            backdropFilter: 'blur(20px)',
            borderRadius: { xs: '20px', md: '46px' },
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: { xs: '8px 14px', md: '12px 24px' },
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            width: '100%',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              minHeight: { xs: '36px', md: '40px' },
              flexWrap: 'nowrap',
              gap: { xs: 1, md: 0 },
              overflow: 'hidden'
            }}>
              <Box display="flex" alignItems="center" gap={2} sx={{ minWidth: 0 }}>
                <img src="/logo.png" alt="Trusty Health" width={34} height={34} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#fff', 
                    fontWeight: 600, 
                    textDecoration: 'none', 
                    fontSize: { xs: '1.05rem', md: '1.25rem' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: { xs: '50vw', md: 'none' }
                  }} 
                  component="a" 
                  href="/"
                >
                  Trusty 
                </Typography>
              </Box>
            {/* Desktop nav */}
            <Box display={{ xs: 'none', md: 'flex' }} gap={1} alignItems="center">
              <Button component={Link} href="/" sx={{ 
                fontWeight: 500, 
                color: '#fff', 
                textTransform: 'none',
                fontSize: '14px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-1px)'
                } 
              }}>Home</Button>
              <Button component={Link} href="/verify" sx={{ 
                fontWeight: 500, 
                color: '#fff', 
                textTransform: 'none',
                fontSize: '14px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-1px)'
                } 
              }}>Health Records</Button>
              <Button component={Link} href="/transactions" sx={{ 
                fontWeight: 500, 
                color: '#fff', 
                textTransform: 'none',
                fontSize: '14px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-1px)'
                } 
              }}>Transactions</Button>
              <Button component={Link} href="/wallet-demo" sx={{ 
                fontWeight: 500, 
                color: '#fff', 
                textTransform: 'none',
                fontSize: '14px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-1px)'
                } 
              }}>Wallet Connect</Button>
              <Button component={Link} href="/about" sx={{ 
                fontWeight: 500, 
                color: '#fff', 
                textTransform: 'none',
                fontSize: '14px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-1px)'
                } 
              }}>About</Button>

              <Button component={Link} href="/issuer-dashboard" sx={{
                fontWeight: 500,
                color: '#fff',
                textTransform: 'none',
                fontSize: '14px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-1px)'
                }
              }}>Issuer Dashboard</Button>
              <Box display={{ xs: 'none', md: 'inline-flex' }}>
                <WalletConnect />
              </Box>
            </Box>
            {/* Mobile actions */}
            <Box display={{ xs: 'flex', md: 'none' }} alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
              <IconButton aria-label="menu" onClick={openMobileMenu} sx={{ color: '#fff' }}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={closeMobileMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: {
                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    minWidth: 240,
                    borderRadius: 2,
                    p: 0.5
                  }
                }}
              >
                <MenuItem component={Link} href="/" onClick={closeMobileMenu}>Home</MenuItem>
                <MenuItem component={Link} href="/verify" onClick={closeMobileMenu}>Health Records</MenuItem>
                <MenuItem component={Link} href="/transactions" onClick={closeMobileMenu}>Transactions</MenuItem>
                <MenuItem component={Link} href="/wallet-demo" onClick={closeMobileMenu}>Wallet Connect</MenuItem>
                <MenuItem component={Link} href="/issuer-dashboard" onClick={closeMobileMenu}>Issuer Dashboard</MenuItem>
                <MenuItem component={Link} href="/about" onClick={closeMobileMenu}>About</MenuItem>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 0.5 }} />
                <Box sx={{ px: 1.5, pb: 1.5 }}>
                  <WalletConnect />
                </Box>
              </Menu>
            </Box>
            </Box>
          </Box>
        </Container>
      </AppBar>
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: { xs: '128px', sm: '116px', md: '120px' },
        width: '100%'
      }}>
        {children}
      </Box>
      <Footer />
    </StarsBackground>
  );
} 