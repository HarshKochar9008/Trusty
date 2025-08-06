"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress, 
  Button, 
  Tabs, 
  Tab, 
  Chip, 
  Grid, 
  IconButton, 
  Tooltip, 
  Badge,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { useWallet } from '@/lib/walletContext';
import { VerifiedDocument, VerifiedDocumentsResponse } from '@/types/verifiedDocument';
import { 
  AccountBalanceWallet, 
  Receipt, 
  Send, 
  Download, 
  Refresh,
  CheckCircle,
  Error,
  Schedule,
  TrendingDown,
  VerifiedUser,
  Security,
  Assessment,
  Search,
  FilterList,
  ExpandMore,
  HealthAndSafety,
  Description,
  Timeline,
  LocalHospital,
  Verified,
  Warning,
  Info
} from '@mui/icons-material';

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

interface HealthRecordTransaction extends VerifiedDocument {
  transactionType: 'health_record_verification';
  patientInfo?: {
    name?: string;
    type?: string;
    issuer?: string;
    date?: string;
  };
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
  const [verifiedDocuments, setVerifiedDocuments] = useState<VerifiedDocument[]>([]);
  const [healthRecordTransactions, setHealthRecordTransactions] = useState<HealthRecordTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    loadHederaTransactions();
    loadVerifiedDocuments();
    if (isConnected && walletType === 'metamask') {
      loadWalletTransactions();
    }
  }, [isConnected, walletType]);

  useEffect(() => {
    // Process verified documents to extract health record transactions
    const healthRecords = verifiedDocuments.map(doc => ({
      ...doc,
      transactionType: 'health_record_verification' as const,
      patientInfo: extractPatientInfo(doc.message)
    }));
    setHealthRecordTransactions(healthRecords);
  }, [verifiedDocuments]);

  const extractPatientInfo = (message: string) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.geminiResult?.extractedData) {
        return parsed.geminiResult.extractedData;
      }
      return {};
    } catch {
      return {};
    }
  };

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

  const loadVerifiedDocuments = async () => {
    try {
      const response = await axios.get<VerifiedDocumentsResponse>("http://localhost:3001/api/verified-documents");
      setVerifiedDocuments(response.data.verifiedDocuments || []);
    } catch (err: any) {
      console.error("Failed to fetch verified documents:", err);
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

  const getVerifiedDocumentIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Verified sx={{ color: '#4caf50' }} />;
      case 'failed':
        return <Error sx={{ color: '#f44336' }} />;
      default:
        return <Security sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#4caf50';
    if (confidence >= 0.6) return '#ff9800';
    return '#f44336';
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'high':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
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

  const filterTransactions = (transactions: any[], type: string) => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => {
        if (type === 'health') {
          return tx.hash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 tx.patientInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 tx.patientInfo?.issuer?.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (type === 'wallet') {
          return tx.hash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 tx.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 tx.to?.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          return tx.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 tx.sequenceNumber?.toString().includes(searchTerm);
        }
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => {
        if (type === 'health') {
          return tx.status === statusFilter;
        } else if (type === 'wallet') {
          return tx.status === statusFilter;
        }
        return true; // For Hedera transactions, no status filter
      });
    }

    return filtered;
  };

  const exportTransactions = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 0) {
      const filteredTxs = filterTransactions(walletTransactions, 'wallet');
      csvContent += "Hash,From,To,Value,Type,Status,Timestamp\n" +
        filteredTxs.map((tx: Transaction) => 
          `${tx.hash},${tx.from},${tx.to},${tx.value},${tx.type},${tx.status},${tx.timestamp ? formatTimestamp(tx.timestamp) : ''}`
        ).join('\n');
    } else if (activeTab === 1) {
      const filteredMsgs = filterTransactions(messages, 'hedera');
      csvContent += "Sequence,Timestamp,Message\n" +
        filteredMsgs.map((msg: Message) => 
          `${msg.sequenceNumber},${msg.consensusTimestamp},${msg.message}`
        ).join('\n');
    } else if (activeTab === 2) {
      const filteredDocs = filterTransactions(healthRecordTransactions, 'health');
      csvContent += "Transaction ID,Hash,Status,Confidence,Risk Level,Patient Name,Issuer,Date,Passed Checks,Total Checks,Timestamp\n" +
        filteredDocs.map((doc: HealthRecordTransaction) => 
          `${doc.transactionId},${doc.hash},${doc.status},${doc.aiVerification.confidence},${doc.aiVerification.riskLevel},${doc.patientInfo?.name || 'N/A'},${doc.patientInfo?.issuer || 'N/A'},${doc.patientInfo?.date || 'N/A'},${doc.aiVerification.passedChecks},${doc.aiVerification.totalChecks},${doc.timestamp}`
        ).join('\n');
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const tabNames = ['wallet', 'hedera', 'health_records'];
    link.setAttribute("download", `transactions_${tabNames[activeTab]}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTransactionStats = () => {
    const stats = {
      total: 0,
      verified: 0,
      failed: 0,
      pending: 0
    };

    if (activeTab === 0) {
      stats.total = walletTransactions.length;
      walletTransactions.forEach(tx => {
        if (tx.status === 'confirmed') stats.verified++;
        else if (tx.status === 'pending') stats.pending++;
        else if (tx.status === 'failed') stats.failed++;
      });
    } else if (activeTab === 1) {
      stats.total = messages.length;
    } else if (activeTab === 2) {
      stats.total = healthRecordTransactions.length;
      healthRecordTransactions.forEach(doc => {
        if (doc.status === 'verified') stats.verified++;
        else if (doc.status === 'failed') stats.failed++;
      });
    }

    return stats;
  };

  const stats = getTransactionStats();

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
              Transaction History
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontWeight: 500,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            lineHeight: 1.4,
            mb: 3,
          }}>
            Explore and track all blockchain transactions
          </Typography>
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ mb: 8 }}>

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
                label={`Wallet Transactions (${walletTransactions.length})`}
                disabled={!isConnected || walletType !== 'metamask'}
              />
              <Tab icon={<Receipt />} label={`Hedera Transactions (${messages.length})`} />
              <Tab 
                icon={
                  <Badge badgeContent={healthRecordTransactions.length} color="primary">
                    <HealthAndSafety />
                  </Badge>
                } 
                label="Health Record Transactions" 
              />
            </Tabs>
          </Box>

          {/* Statistics */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Timeline />} 
              label={`Total: ${stats.total}`} 
              sx={{ backgroundColor: 'rgba(33, 150, 243, 0.2)', color: '#2196f3' }}
            />
            {activeTab !== 1 && (
              <>
                <Chip 
                  icon={<CheckCircle />} 
                  label={`Verified: ${stats.verified}`} 
                  sx={{ backgroundColor: 'rgba(76, 175, 80, 0.2)', color: '#4caf50' }}
                />
                <Chip 
                  icon={<Error />} 
                  label={`Failed: ${stats.failed}`} 
                  sx={{ backgroundColor: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }}
                />
                {stats.pending > 0 && (
                  <Chip 
                    icon={<Schedule />} 
                    label={`Pending: ${stats.pending}`} 
                    sx={{ backgroundColor: 'rgba(255, 152, 0, 0.2)', color: '#ff9800' }}
                  />
                )}
              </>
            )}
          </Box>

          {/* Search and Filter Controls */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />
            
            {activeTab !== 1 && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff',
                    },
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            )}

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                if (activeTab === 0) {
                  loadWalletTransactions();
                } else if (activeTab === 1) {
                  loadHederaTransactions();
                } else if (activeTab === 2) {
                  loadVerifiedDocuments();
                }
              }}
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
              disabled={
                (activeTab === 0 && walletTransactions.length === 0) ||
                (activeTab === 1 && messages.length === 0) ||
                (activeTab === 2 && healthRecordTransactions.length === 0)
              }
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
                      {filterTransactions(walletTransactions, 'wallet').map((tx, idx) => (
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
                  {filterTransactions(messages, 'hedera').map((msg, idx) => (
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

              {/* Health Record Transactions Tab */}
              {activeTab === 2 && (
                <Box>
                  {healthRecordTransactions.length === 0 ? (
                    <Alert severity="info">
                      No health record transactions found. Upload and verify health records to see them here.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {filterTransactions(healthRecordTransactions, 'health').map((doc, idx) => (
                        <Card key={idx} sx={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 2
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {getVerifiedDocumentIcon(doc.status)}
                                <Box>
                                  <Typography sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                                    Health Record Verification #{doc.sequenceNumber}
                                  </Typography>
                                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                    Hash: {doc.hash.slice(0, 16)}...{doc.hash.slice(-8)}
                                  </Typography>
                                  {doc.patientInfo?.name && (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, mt: 0.5 }}>
                                      <strong>Patient:</strong> {doc.patientInfo.name}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Chip 
                                  icon={doc.status === 'verified' ? <CheckCircle /> : <Error />} 
                                  label={doc.status === 'verified' ? 'Verified' : 'Failed'} 
                                  color={doc.status === 'verified' ? 'success' : 'error'} 
                                  size="small" 
                                />
                                <Typography sx={{ color: '#fff', fontWeight: 600, mt: 1 }}>
                                  {Math.round(doc.aiVerification.confidence * 100)}% Confidence
                                </Typography>
                              </Box>
                            </Box>
                            
                            {/* Patient Information */}
                            {doc.patientInfo && Object.keys(doc.patientInfo).length > 0 && (
                              <Paper sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                                p: 2, 
                                mb: 2,
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                              }}>
                                <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocalHospital sx={{ fontSize: 20 }} />
                                  Patient Information
                                </Typography>
                                <Grid container spacing={2}>
                                  {doc.patientInfo.name && (
                                    <Grid item xs={12} sm={6}>
                                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                                        <strong>Name:</strong> {doc.patientInfo.name}
                                      </Typography>
                                    </Grid>
                                  )}
                                  {doc.patientInfo.type && (
                                    <Grid item xs={12} sm={6}>
                                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                                        <strong>Type:</strong> {doc.patientInfo.type}
                                      </Typography>
                                    </Grid>
                                  )}
                                  {doc.patientInfo.issuer && (
                                    <Grid item xs={12} sm={6}>
                                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                                        <strong>Issuer:</strong> {doc.patientInfo.issuer}
                                      </Typography>
                                    </Grid>
                                  )}
                                  {doc.patientInfo.date && (
                                    <Grid item xs={12} sm={6}>
                                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                                        <strong>Date:</strong> {doc.patientInfo.date}
                                      </Typography>
                                    </Grid>
                                  )}
                                </Grid>
                              </Paper>
                            )}
                            
                            <Box sx={{ 
                              display: 'grid', 
                              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                              gap: 2, 
                              mb: 2 
                            }}>
                              <Box>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                  <strong>Transaction ID:</strong> {doc.transactionId}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                  <strong>Model:</strong> {doc.model}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                  <strong>Risk Level:</strong> 
                                  <Chip 
                                    label={doc.aiVerification.riskLevel} 
                                    size="small" 
                                    sx={{ 
                                      ml: 1, 
                                      backgroundColor: getRiskLevelColor(doc.aiVerification.riskLevel),
                                      color: '#fff',
                                      fontSize: 10
                                    }} 
                                  />
                                </Typography>
                              </Box>
                              <Box>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                  <strong>Checks:</strong> {doc.aiVerification.passedChecks}/{doc.aiVerification.totalChecks}
                                </Typography>
                              </Box>
                              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '1 / -1' } }}>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                                  <strong>Timestamp:</strong> {new Date(doc.timestamp).toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>

                            {/* AI Verification Details */}
                            <Accordion sx={{ 
                              backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                              color: '#fff',
                              '&:before': { display: 'none' },
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#fff' }} />}>
                                <Typography sx={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Assessment sx={{ fontSize: 20 }} />
                                  AI Verification Details
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: 1,
                                  width: '100%',
                                  mb: 2
                                }}>
                                  <Chip 
                                    icon={<Assessment />}
                                    label={`${Math.round(doc.aiVerification.confidence * 100)}% Confidence`}
                                    size="small"
                                    sx={{ 
                                      backgroundColor: getConfidenceColor(doc.aiVerification.confidence),
                                      color: '#fff',
                                      flexShrink: 0
                                    }}
                                  />
                                  {doc.aiVerification.verificationMethods && doc.aiVerification.verificationMethods.map((method, methodIdx) => (
                                    <Chip 
                                      key={methodIdx}
                                      label={method}
                                      size="small"
                                      sx={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#fff',
                                        flexShrink: 0
                                      }}
                                    />
                                  ))}
                                </Box>
                                
                                {/* Raw Verification Data */}
                                <Box sx={{ 
                                  backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                                  p: 2, 
                                  borderRadius: 2,
                                  maxHeight: '200px',
                                  overflow: 'auto'
                                }}>
                                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, mb: 1 }}>
                                    <strong>Raw Data:</strong>
                                  </Typography>
                                  <pre style={{ 
                                    color: '#fff', 
                                    margin: 0, 
                                    fontSize: '10px',
                                    fontFamily: 'monospace',
                                    lineHeight: 1.4
                                  }}>
                                    {JSON.stringify(JSON.parse(doc.message), null, 2)}
                                  </pre>
                                </Box>
                              </AccordionDetails>
                            </Accordion>

                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button 
                                href={`https://hashscan.io/testnet/transaction/${doc.transactionId}`} 
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
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(doc.hash);
                                }}
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
                                Copy Hash
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
      </Box>
    </Container>
  );
} 