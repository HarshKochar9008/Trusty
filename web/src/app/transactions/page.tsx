'use client'

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  Send, 
  Receipt, 
  TrendingUp,
  TrendingDown,
  Refresh,
  Visibility,
  VisibilityOff,
  Timeline,
  Speed,
  Security,
  CheckCircle,
  Error,
  Warning,
  Info
} from '@mui/icons-material';
import { useWallet } from '@/lib/walletContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  nonce: number;
  blockNumber: number;
  blockHash: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'send' | 'receive';
  description: string;
}

export default function TransactionsPage() {
  const { isConnected, accountId, getTransactionHistory, transactions, isLoading, error } = useWallet();
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoRefresh && isConnected) {
      const interval = setInterval(() => {
        getTransactionHistory();
      }, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, isConnected]);

  const handleRefresh = () => {
    if (isConnected) {
      getTransactionHistory();
    }
  };

  const toggleDetails = (hash: string) => {
    setShowDetails(prev => ({
      ...prev,
      [hash]: !prev[hash]
    }));
  };

  const formatAddress = (address: string) => {
    if (address.length > 12) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    return address;
  };

  const formatValue = (value: string) => {
    const num = parseFloat(value);
    return num.toFixed(6);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'failed': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <Warning />;
      case 'failed': return <Error />;
      default: return <Info />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send': return <TrendingDown />;
      case 'receive': return <TrendingUp />;
      default: return <Receipt />;
    }
  };

  if (!isConnected) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          py: 8
        }}>
          <AccountBalanceWallet sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.5)', mb: 2 }} />
          <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
            Connect Your Wallet
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
            Please connect your wallet to view transaction history.
          </Typography>
          <Chip 
            label="Wallet Not Connected" 
            color="error" 
            icon={<Error />}
            sx={{ backgroundColor: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }}
          />
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" sx={{
            fontWeight: 700,
          mb: 2,
          background: 'linear-gradient(135deg, #10A74A 0%, rgb(71, 111, 255) 100%)',
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Transaction History
          </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
          Real-time blockchain transaction monitoring for {formatAddress(accountId || '')}
          </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
      <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            p: 3
          }}>
            <Timeline sx={{ fontSize: 40, color: '#10A74A', mb: 1 }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
              {transactions.length}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Total Transactions
            </Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
                          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            p: 3
          }}>
            <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
              {transactions.filter(tx => tx.status === 'confirmed').length}
                                    </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Confirmed
                                    </Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            p: 3
          }}>
            <Speed sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
              {transactions.filter(tx => tx.status === 'pending').length}
                                  </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Pending
                                  </Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            p: 3
          }}>
            <Security sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
              {transactions.filter(tx => tx.type === 'send').length}
                                  </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Sent
                                  </Typography>
          </Card>
        </motion.div>
                              </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                                <Button 
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={isLoading}
                                  sx={{
            backgroundColor: 'rgba(16, 167, 74, 0.8)',
                                    '&:hover': {
              backgroundColor: 'rgba(16, 167, 74, 1)'
                                    }
                                  }}
                                >
          {isLoading ? 'Refreshing...' : 'Refresh'}
                                </Button>

                                  <Button 
          variant={autoRefresh ? "contained" : "outlined"}
          onClick={() => setAutoRefresh(!autoRefresh)}
                                    sx={{
                                      borderColor: 'rgba(255, 255, 255, 0.3)',
            color: autoRefresh ? '#fff' : 'rgba(255, 255, 255, 0.7)',
            backgroundColor: autoRefresh ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
          }}
        >
          Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
                                  </Button>
                              </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Transactions List */}
      <AnimatePresence>
        {transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              py: 8
            }}>
              <Receipt sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                No transactions found
                        </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Your transaction history will appear here once you make transactions.
                        </Typography>
                    </Card>
          </motion.div>
        ) : (
          <List>
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.hash}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                  mb: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ListItemIcon>
                          {getTypeIcon(tx.type)}
                        </ListItemIcon>
                                <Box>
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                            {tx.description}
                                  </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {formatTimestamp(tx.timestamp)}
                                    </Typography>
                                </Box>
                              </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                          label={tx.status}
                          icon={getStatusIcon(tx.status)}
                          sx={{
                            backgroundColor: `${getStatusColor(tx.status)}20`,
                            color: getStatusColor(tx.status),
                            border: `1px solid ${getStatusColor(tx.status)}40`
                          }}
                        />
                        <Tooltip title={showDetails[tx.hash] ? "Hide Details" : "Show Details"}>
                          <IconButton
                            onClick={() => toggleDetails(tx.hash)}
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            {showDetails[tx.hash] ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </Tooltip>
                              </Box>
                            </Box>
                            
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                        {formatValue(tx.value)} ETH
                                </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Block #{tx.blockNumber}
                                      </Typography>
                                    </Box>

                    <AnimatePresence>
                      {showDetails[tx.hash] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                                                     <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                           <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                              <Box>
                               <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                 From: {formatAddress(tx.from)}
                               </Typography>
                               <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                 To: {formatAddress(tx.to)}
                                </Typography>
                               <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                 Gas Used: {tx.gas}
                                </Typography>
                              </Box>
                              <Box>
                               <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                 Gas Price: {formatValue(tx.gasPrice)} Gwei
                                </Typography>
                               <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                 Nonce: {tx.nonce}
                                </Typography>
                               <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                 Hash: {formatAddress(tx.hash)}
                                </Typography>
                              </Box>
                            </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                          </CardContent>
                        </Card>
              </motion.div>
            ))}
          </List>
        )}
      </AnimatePresence>
    </Container>
  );
} 