import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, CardContent, Typography, Box, Alert, CircularProgress } from '@mui/material';

export default function TopicPage() {
  const [info, setInfo] = useState<any>(null);
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
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Card sx={{ boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
            Topic Information
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Box>
              <pre style={{ background: '#f6f8fa', padding: 16, borderRadius: 8, marginTop: 8 }}>
                {JSON.stringify(info, null, 2)}
              </pre>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
} 