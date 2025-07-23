'use client'
import React, { useState } from 'react';
import {
  Container, Box, Typography, Button, Card, CardContent, TextField, Link, Alert
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('record', file);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Failed to verify record.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box display="flex" alignItems="center" gap={2} mb={5}>
        <HealthAndSafetyIcon color="primary" sx={{ fontSize: 56 }} />
        <Box>
          <Typography variant="h3" fontWeight={800} color="primary" gutterBottom>
            Trusty Health Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Securely verify, timestamp, and manage your health records with AI and Hedera Hashgraph.
          </Typography>
        </Box>
      </Box>
      <Box display="flex" gap={3} mb={5} flexWrap="wrap">
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AssignmentTurnedInIcon />}
          href="/verify"
        >
          Verify Record
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<HistoryIcon />}
          href="/transactions"
        >
          Transaction History
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<InfoIcon />}
          href="/topic"
        >
          Topic Info
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<LocalHospitalIcon />}
          href="/about"
        >
          About
        </Button>
      </Box>
      <Card sx={{ boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
            Upload & Verify Your Health Record
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <TextField
                type="file"
                inputProps={{ accept: '.json,.pdf,.png,.jpg,.jpeg' }}
                onChange={handleFileChange}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={<AssignmentTurnedInIcon />}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </Box>
          </form>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {result && (
            <Box mt={3}>
              <Typography variant="h6" color="primary">Verification Result</Typography>
              <pre style={{ background: '#f6f8fa', padding: 16, borderRadius: 8, marginTop: 8 }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
