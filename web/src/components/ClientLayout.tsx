'use client'

import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';

import { WalletConnect } from './WalletConnect';
import { StarsBackground } from './core/backgrounds/stars';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <StarsBackground className="min-h-screen flex flex-col">
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          borderBottom: 'none',
          zIndex: 1000,
          padding: '16px 0'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{
            backgroundColor: 'rgba(40, 40, 40, 0.35)',
            backdropFilter: 'blur(20px)',
            borderRadius: '46px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px 24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              minHeight: '40px',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              gap: { xs: 2, md: 0 }
            }}>
              <Box display="flex" alignItems="center" gap={2}>
              <img src="/logo.png" alt="Trusty Health" width={40} height={40} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }} component="a" href="/">
                Trusty 
              </Typography>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
              <Button href="/" sx={{ 
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
              <Button href="/verify" sx={{ 
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
              <Button href="/transactions" sx={{ 
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
              <Button href="/wallet-demo" sx={{ 
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
              <Button href="/about" sx={{ 
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
              <Button href="/ai-analytics" sx={{ 
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
              }}>AI Dashboard</Button>
              <Button href="/issuer-dashboard" sx={{
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
              <WalletConnect />
            </Box>
            </Box>
          </Box>
        </Container>
      </AppBar>
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '120px', // Add proper top padding to account for fixed header
        width: '100%'
      }}>
        {children}
      </Box>
      <Footer />
    </StarsBackground>
  );
} 