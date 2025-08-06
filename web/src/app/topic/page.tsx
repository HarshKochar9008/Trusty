"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, CardContent, Typography, Box, Alert, CircularProgress } from '@mui/material';


export default function TopicPage() {
  const [info, setInfo] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
          axios.get("/api/topic")
      .then(res => {
        setInfo(res.data);
        setError("");
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message || "Failed to fetch topic info.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ 
        position: 'relative',
        mb: 8,
        mt: 4
      }}>
        <Box sx={{ 
          position: 'relative',
          zIndex: 2,
          maxWidth: { xs: '100%', lg: '80%' },
          textAlign: 'center',
          mx: 'auto'
        }}>
          <Typography variant="h1" sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
            lineHeight: 1.1
          }}>
            <Box component="span" sx={{ 
              background: 'linear-gradient(135deg, #10A74A 0%,rgb(71, 111, 255) 100%)',
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Blockchain Topic Details
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontWeight: 500,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            lineHeight: 1.4,
            mb: 3,
          }}>
            View Hedera blockchain topic information and configuration
          </Typography>
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ mb: 8 }}>
        <Card sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '800px',
          mx: 'auto'
        }}>
          <CardContent sx={{ p: 4 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress sx={{ color: '#fff' }} />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Box sx={{ 
                background: 'rgba(0, 0, 0, 0.3)', 
                padding: 3, 
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <pre style={{ color: '#fff', margin: 0, fontSize: '14px' }}>
                  {JSON.stringify(info, null, 2)}
                </pre>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Spacer Section for proper scrolling */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ 
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.3)', 
            fontSize: '14px',
            textAlign: 'center'
          }}>
            Blockchain Topic Information
          </Typography>
        </Box>
      </Box>
    </Container>
  );
} 