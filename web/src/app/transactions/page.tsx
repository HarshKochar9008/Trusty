"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, CardContent, Typography, Box, Alert, CircularProgress, Button, Tabs, Tab, Chip, Grid, IconButton, Tooltip } from '@mui/material';
import { useWallet } from '@/lib/walletContext';
import { 
  AccountBalanceWallet, 
  Receipt, 
  Send, 
  Download, 
  Refresh,
  CheckCircle,
  Error,
  Schedule,
  TrendingDown
} from '@mui/icons-material';
import Footer from '@/components/Footer';


interface Message {
  sequenceNumber: number;
  consensusTimestamp: string;
  message: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  nonce: number;
  blockNumber?: number;
  blockHash?: string;
  timestamp?: number;
  status?: 'pending' | 'confirmed' | 'failed';
  type: 'send' | 'receive' | 'contract' | 'approval';
  description?: string;
}

export default function TransactionsPage() {
  const { 
    isConnected, 
    accountId, 
    walletType, 
    transactions: walletTransactions, 
    getTransactionHistory,
    isLoading: walletLoading 
  } = useWallet();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHederaTransactions();
    if (isConnected && walletType === 'metamask') {
      loadWalletTransactions();
    }
  }, [isConnected, walletType]);

  const loadHederaTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/topic/messages");
      setMessages(response.data.messages || []);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to fetch Hedera transactions.");
    } finally {
      setLoading(false);
    }
  };

  const loadWalletTransactions = async () => {
    if (isConnected && walletType === 'metamask') {
      setRefreshing(true);
      try {
        await getTransactionHistory();
      } catch (err) {
        console.error('Failed to load wallet transactions:', err);
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <Send sx={{ color: '#f44336' }} />;
      case 'receive':
        return <TrendingDown sx={{ color: '#4caf50' }} />;
      case 'contract':
        return <Receipt sx={{ color: '#2196f3' }} />;
      case 'approval':
        return <CheckCircle sx={{ color: '#ff9800' }} />;
      default:
        return <Receipt sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getStatusChip = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return <Chip icon={<CheckCircle />} label="Confirmed" color="success" size="small" />;
      case 'pending':
        return <Chip icon={<Schedule />} label="Pending" color="warning" size="small" />;
      case 'failed':
        return <Chip icon={<Error />} label="Failed" color="error" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const exportTransactions = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      (activeTab === 0 ? 
        "Hash,From,To,Value,Type,Status,Timestamp\n" +
        walletTransactions.map((tx: Transaction) => 
          `${tx.hash},${tx.from},${tx.to},${tx.value},${tx.type},${tx.status},${tx.timestamp ? formatTimestamp(tx.timestamp) : ''}`
        ).join('\n') :
        "Sequence,Timestamp,Message\n" +
        messages.map((msg: Message) => 
          `${msg.sequenceNumber},${msg.consensusTimestamp},${msg.message}`
        ).join('\n')
      );
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${activeTab === 0 ? 'wallet' : 'hedera'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ 
        py: 8, 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 120px)'
      }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight={300} sx={{ color: '#fff', mb: 2 }}>
          Transaction History
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 400 }}>
          Explore and track all blockchain transactions
        </Typography>
      </Box>

      <Card sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Wallet Connection Status */}
          {!isConnected && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Connect your MetaMask wallet to view wallet transaction history
            </Alert>
          )}

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-selected': {
                    color: '#fff'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#fff'
                }
              }}
            >
              <Tab 
                icon={<AccountBalanceWallet />} 
                label="Wallet Transactions" 
                disabled={!isConnected || walletType !== 'metamask'}
              />
              <Tab icon={<Receipt />} label="Hedera Transactions" />
            </Tabs>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={activeTab === 0 ? loadWalletTransactions : loadHederaTransactions}
              disabled={refreshing || loading}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={exportTransactions}
              disabled={activeTab === 0 ? walletTransactions.length === 0 : messages.length === 0}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Export CSV
            </Button>
          </Box>

          {/* Content */}
          {loading || walletLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress sx={{ color: '#fff' }} />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Box>
              {/* Wallet Transactions Tab */}
              {activeTab === 0 && (
                <Box>
                  {walletTransactions.length === 0 ? (
                    <Alert severity="info">
                      No wallet transactions found. Connect MetaMask and make some transactions to see them here.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {walletTransactions.map((tx, idx) => (
                        <Box key={idx}>
                          <Card sx={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  {getTransactionIcon(tx.type)}
                                  <Box>
                                    <Typography sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                                      {tx.description || `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} Transaction`}
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                      {tx.hash}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  {getStatusChip(tx.status)}
                                  <Typography sx={{ color: '#fff', fontWeight: 600, mt: 1 }}>
                                    {parseFloat(tx.value).toFixed(6)} ETH
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                    From: {formatAddress(tx.from)}
                                  </Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                    To: {formatAddress(tx.to)}
                                  </Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                    Gas: {tx.gas}
                                  </Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                    Gas Price: {parseFloat(tx.gasPrice).toFixed(2)} Gwei
                                  </Typography>
                                </Box>
                                {tx.timestamp && (
                                  <Box sx={{ width: '100%' }}>
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                      Time: {formatTimestamp(tx.timestamp)}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>

                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button 
                                  href={`https://etherscan.io/tx/${tx.hash}`} 
                                  target="_blank" 
                                  rel="noopener"
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    color: '#fff',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    fontSize: 12,
                                    '&:hover': {
                                      borderColor: '#fff',
                                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                  }}
                                >
                                  View on Etherscan
                                </Button>
                                {tx.blockNumber && (
                                  <Button 
                                    href={`https://etherscan.io/block/${tx.blockNumber}`} 
                                    target="_blank" 
                                    rel="noopener"
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      color: '#fff',
                                      borderColor: 'rgba(255, 255, 255, 0.3)',
                                      fontSize: 12,
                                      '&:hover': {
                                        borderColor: '#fff',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                      }
                                    }}
                                  >
                                    View Block
                                  </Button>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* Hedera Transactions Tab */}
              {activeTab === 1 && (
                <Box display="flex" flexDirection="column" gap={3}>
                  {messages.map((msg, idx) => (
                    <Card key={idx} sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                          Sequence #{msg.sequenceNumber}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, mb: 1 }}>
                          <strong>Timestamp:</strong> {msg.consensusTimestamp}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, mb: 2 }}>
                          <strong>Message:</strong> <span style={{ wordBreak: 'break-all' }}>{msg.message}</span>
                        </Typography>
                        <Button 
                          href={`https://hashscan.io/testnet/transaction/${msg.consensusTimestamp}`} 
                          target="_blank" 
                          rel="noopener"
                          variant="outlined"
                          size="small"
                          sx={{
                            color: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            fontSize: 12,
                            '&:hover': {
                              borderColor: '#fff',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          View on HashScan
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
    <Footer />
  </>
  );
} 