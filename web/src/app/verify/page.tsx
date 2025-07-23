"use client";
import React, { useState } from "react";
import axios from "axios";
import { Container, Card, CardContent, Typography, Button, Box, Alert, Link, CircularProgress } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError("");
    if (!file) {
      setError("Please select your health record.");
      return;
    }
    const formData = new FormData();
    formData.append("record", file);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/verify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Card sx={{ boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
            Verify Health Record
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <input
                type="file"
                accept=".json,.pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                style={{ flex: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={<AssignmentTurnedInIcon />}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Verify"}
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
              {result.hashscanUrl && (
                <Link href={result.hashscanUrl} target="_blank" rel="noopener" color="primary" fontWeight={600} fontSize={15}>
                  View on HashScan
                </Link>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
} 