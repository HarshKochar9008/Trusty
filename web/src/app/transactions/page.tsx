"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, CardContent, Typography, Box, Alert, Link, CircularProgress } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

export default function TransactionsPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3001/api/topic/messages")
      .then(res => {
        setMessages(res.data.messages || []);
        setError("");
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message || "Failed to fetch transactions.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Card sx={{ boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
            Transaction History
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {messages.map((msg, idx) => (
                <Card key={idx} sx={{ background: '#f6f8fa', borderRadius: 2, boxShadow: 1 }}>
                  <CardContent>
                    <Typography fontWeight={600} color="primary" mb={1}>
                      Sequence #{msg.sequenceNumber}
                    </Typography>
                    <Typography color="text.secondary" fontSize={15} mb={1}>
                      <strong>Timestamp:</strong> {msg.consensusTimestamp}
                    </Typography>
                    <Typography color="text.secondary" fontSize={15} mb={1}>
                      <strong>Message:</strong> <span style={{ wordBreak: 'break-all' }}>{msg.message}</span>
                    </Typography>
                    <Link href={`https://hashscan.io/testnet/transaction/${msg.consensusTimestamp}`} target="_blank" rel="noopener" color="primary" fontWeight={600} fontSize={15}>
                      View on HashScan
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
} 