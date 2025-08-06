'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            p: 4,
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
              Something went wrong
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 4 }}>
              We encountered an unexpected error. Please try refreshing the page.
            </Typography>
            {this.state.error && (
              <Box sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                p: 3, 
                borderRadius: 2,
                mb: 3,
                textAlign: 'left'
              }}>
                <Typography variant="h6" sx={{ color: '#f44336', mb: 2 }}>
                  Error Details:
                </Typography>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: 14,
                  fontFamily: 'monospace',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.message}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                backgroundColor: '#10A74A',
                color: '#fff',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#0d8a3d'
                }
              }}
            >
              Refresh Page
            </Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 