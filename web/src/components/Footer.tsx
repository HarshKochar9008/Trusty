import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        py: 2,
        mt: 'auto',
        width: '100%',
        flexShrink: 0
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 2
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(135deg, #10A74A 0%, #2F52D1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Hedera Trusty
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                mt: 0.5
              }}
            >
              Secure health record verification
            </Typography>
          </Box>
          <Box>
            <Link href="https://x.com/Too_harshk" target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none' }}>
              <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              Contact Us
            </Typography>
            </Link>
          </Box>
        </Box>
        
        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            mt: 2,
            pt: 2,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)'
            }}
          >
          © 2025 Hedera Trusty. Powered by AI & Hedera Hashgraph.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
} 