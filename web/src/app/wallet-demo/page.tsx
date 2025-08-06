'use client'

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Alert, 
  Chip, 
  Grid,
  Divider,
  Paper
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  Send, 
  FileUpload, 
  Topic, 
  Receipt,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { useWallet } from '@/lib/walletContext';
import { createHederaUtils, NetworkName } from '@/lib/hederaUtils';
import Footer from '@/components/Footer';


export default function WalletDemoPage() {
  const { isConnected, accountId, balance, signMessage } = useWallet();
  const [message, setMessage] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [topicId, setTopicId] = useState('');
  const [topicMessage, setTopicMessage] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileId, setFileId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignMessage = async () => {
    if (!message.trim()) {
      setError('Please enter a message to sign');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const signature = await signMessage(message);
      if (signature) {
        setSignedMessage(signature);
        setSuccess('Message signed successfully!');
      }
    } catch (err) {
      setError('Failed to sign message');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const hederaUtils = createHederaUtils(NetworkName.Testnet);
      const newTopicId = await hederaUtils.createTopic('Health Record Verification Topic');
      setTopicId(newTopicId);
      setSuccess('Topic created successfully!');
    } catch (err) {
      setError('Failed to create topic');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTopicMessage = async () => {
    if (!topicId || !topicMessage.trim()) {
      setError('Please enter topic ID and message');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const hederaUtils = createHederaUtils(NetworkName.Testnet);
      const txId = await hederaUtils.submitTopicMessage(topicId, topicMessage);
      setTransactionId(txId);
      setSuccess('Message submitted to topic successfully!');
    } catch (err) {
      setError('Failed to submit topic message');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFile = async () => {
    if (!fileContent.trim()) {
      setError('Please enter file content');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const hederaUtils = createHederaUtils(NetworkName.Testnet);
      const newFileId = await hederaUtils.createFile(fileContent, 'Health Record File');
      setFileId(newFileId);
      setSuccess('File created successfully!');
    } catch (err) {
      setError('Failed to create file');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <>
        <Container maxWidth="md" sx={{ 
          py: 8, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 120px)'
        }}>
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <CardContent sx={{ textAlign: 'center', py: 8  }}>
            <AccountBalanceWallet sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.5)', mb: 2 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Connect Your Wallet
            </Typography>
                         <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
               Please connect your wallet (MetaMask, WalletConnect, HashPack, or Blade) to access the demo features.
             </Typography>
            <Chip 
              label="Wallet Not Connected" 
              color="error" 
              icon={<Error />}
              sx={{ backgroundColor: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }}
            />
                  </CardContent>
      </Card>
        </Container>
  </>
  );
  }

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
              Wallet Connect & Operations
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontWeight: 500,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            lineHeight: 1.4,
            mb: 3,
          }}>
            Connect your wallet and explore blockchain operations
          </Typography>
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ mb: 8 }}>

      {/* Connection Status */}
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mb: 4
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CheckCircle sx={{ color: '#4caf50' }} />
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Wallet Connected
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Account ID: {accountId}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Balance: {balance} ℏ
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error and Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Message Signing */}
        <Box>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Send sx={{ color: '#fff' }} />
                <Typography variant="h6" sx={{ color: '#fff' }}>
                  Sign Message
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Message to Sign"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { color: '#fff' },
                  inputProps: { style: { color: '#fff' } }
                }}
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleSignMessage}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? 'Signing...' : 'Sign Message'}
              </Button>
              {signedMessage && (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Signature:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff', wordBreak: 'break-all' }}>
                    {signedMessage}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Topic Operations */}
        <Box>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Topic sx={{ color: '#fff' }} />
                <Typography variant="h6" sx={{ color: '#fff' }}>
                  Topic Operations
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCreateTopic}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? 'Creating...' : 'Create Topic'}
              </Button>
              {topicId && (
                <TextField
                  fullWidth
                  label="Topic ID"
                  value={topicId}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: { color: '#fff' },
                    inputProps: { style: { color: '#fff' } }
                  }}
                  InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                />
              )}
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Topic Message"
                value={topicMessage}
                onChange={(e) => setTopicMessage(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { color: '#fff' },
                  inputProps: { style: { color: '#fff' } }
                }}
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmitTopicMessage}
                disabled={loading || !topicId}
                sx={{ mb: 2 }}
              >
                {loading ? 'Submitting...' : 'Submit Message'}
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* File Operations */}
        <Box>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <FileUpload sx={{ color: '#fff' }} />
                <Typography variant="h6" sx={{ color: '#fff' }}>
                  File Operations
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="File Content"
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { color: '#fff' },
                  inputProps: { style: { color: '#fff' } }
                }}
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleCreateFile}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? 'Creating...' : 'Create File'}
              </Button>
              {fileId && (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    File ID:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {fileId}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Transaction History */}
        <Box>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Receipt sx={{ color: '#fff' }} />
                <Typography variant="h6" sx={{ color: '#fff' }}>
                  Recent Transaction
                </Typography>
              </Box>
              {transactionId ? (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Transaction ID:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff', wordBreak: 'break-all' }}>
                    {transactionId}
                  </Typography>
                </Paper>
              ) : (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  No recent transactions
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
      </Box>
    </Container>
  );
} 