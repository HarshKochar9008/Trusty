"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, CardContent, Typography, Box, Alert, CircularProgress } from '@mui/material';
import Footer from '@/components/Footer';

export default function TopicPage() {
  const [info, setInfo] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3001/api/topic/info")
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
    <>
      <Container maxWidth="md" sx={{ 
        py: 8, 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 120px)'
      }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight={300} sx={{ color: '#fff', mb: 2 }}>
          Blockchain Topic Details
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 400 }}>
          View Hedera blockchain topic information and configuration
        </Typography>
      </Box>

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
    </Container>
    <Footer />
  </>
  );
} 