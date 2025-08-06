"use client";
import React, { useState } from "react";
import axios from "axios";
import { Container, Typography, Button, Box, Alert, List, ListItem, ListItemIcon, ListItemText, Divider, Chip, Paper, Stepper, Step, StepLabel, StepContent, CircularProgress, Card, CardContent } from '@mui/material';
import { useWallet } from '@/lib/walletContext';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ShieldIcon from '@mui/icons-material/Shield';

interface VerificationResult {
  hashscanUrl?: string;
  aiVerification?: {
    isValid: boolean;
    confidence: number;
    verificationMethods: {
      llm: any;
      fraud: any;
      medical: any;
      anomaly: any;
    };
    summary: {
      totalChecks: number;
      passedChecks: number;
      riskLevel: string;
      recommendations: string[];
    };
  };
  [key: string]: unknown;
}

interface DocumentVerification {
  documentHash: string;
  signature: string;
  signer: string;
  timestamp: number;
  verified: boolean;
}

export default function VerifyPage() {
  const { 
    isConnected, 
    accountId, 
    walletType, 
    signDocument, 
    verifyDocument, 
    signMessage,
    isLoading: walletLoading 
  } = useWallet();
  
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [documentHash, setDocumentHash] = useState<string>("");
  const [walletSignature, setWalletSignature] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<DocumentVerification | null>(null);
  const [signingInProgress, setSigningInProgress] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleScrollDown = () => {
    const verificationSection = document.getElementById('verification-section');
    if (verificationSection) {
      verificationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError("");
      setDocumentHash("");
      setWalletSignature("");
      setVerificationStatus(null);
      setActiveStep(0);
    }
  };

  const generateDocumentHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError("");
    if (!file) {
      setError("Please select your health record.");
      return;
    }
    
    setLoading(true);
    try {
      const hash = await generateDocumentHash(file);
      setDocumentHash(hash);
      
      const formData = new FormData();
      formData.append("record", file);
      
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
      setActiveStep(1);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletSign = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first.");
      return;
    }
    
    if (!documentHash) {
      setError("Please upload and verify a document first.");
      return;
    }
    
    setSigningInProgress(true);
    setError("");
    
    try {
      const verification = await signDocument(documentHash);
      if (verification) {
        setVerificationStatus(verification);
        setWalletSignature(verification.signature);
        setActiveStep(2);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign document with wallet.");
    } finally {
      setSigningInProgress(false);
    }
  };

  const handleVerifySignature = async () => {
    if (!walletSignature || !documentHash || !accountId) {
      setError("Missing signature, document hash, or wallet address.");
      return;
    }
    
    try {
      const isValid = await verifyDocument(documentHash, walletSignature, accountId);
      if (isValid) {
        setVerificationStatus(prev => prev ? { ...prev, verified: true } : null);
        setActiveStep(3);
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify signature.");
    }
  };

  const handleSignMessage = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first.");
      return;
    }
    
    const message = "I verify that I am the owner of this wallet and authorize this application to verify my documents.";
    
    try {
      const signature = await signMessage(message);
      if (signature) {
        setWalletSignature(signature);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign message.");
    }
  };

  const steps = [
    {
      label: 'Upload Document',
      description: 'Select and upload your health record for verification',
      icon: <FileUploadIcon />
    },
    {
      label: 'AI Verification',
      description: 'Document is analyzed by AI for authenticity and validity',
      icon: <AnalyticsIcon />
    },
    {
      label: 'Wallet Signature',
      description: 'Sign the document with your connected wallet',
      icon: <ShieldIcon />
    },
    {
      label: 'Verification Complete',
      description: 'Document verification and signature validation complete',
      icon: <CheckCircleIcon />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>

<Box sx={{ position: 'relative', mt: 10, minHeight: '50vh' }}>

      <Box id="verification-section" sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ 
          textAlign: 'center', 
          mb: 6,
          fontWeight: 600,
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}>
          Start Verification Process
        </Typography>

        <Paper 
          elevation={0}
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            p: 3,
            mb: 4
          }}
        >
          <Stepper activeStep={activeStep} orientation="horizontal" sx={{ 
            '& .MuiStepLabel-root .Mui-completed': {
              color: '#00D4AA',
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: '#0099CC',
            },
            '& .MuiStepLabel-root .Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
            }
          }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel 
                  StepIconComponent={() => (
                    <Box sx={{ 
                      color: index <= activeStep ? '#00D4AA' : 'rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {step.icon}
                    </Box>
                  )}
                >
                  <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: { xs: '1', md: '0 0 35%' } }}>
            <Paper 
              elevation={0}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <AccountBalanceWalletIcon sx={{ color: isConnected ? '#00D4AA' : '#f44336', fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Wallet Status
                </Typography>
              </Box>
              
              {isConnected ? (
                <Box>
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label="Connected" 
                    sx={{ 
                      backgroundColor: 'rgba(0, 212, 170, 0.2)',
                      color: '#00D4AA',
                      border: '1px solid rgba(0, 212, 170, 0.3)',
                      mb: 2,
                      fontWeight: 600
                    }}
                  />
                  <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 2, borderRadius: 2 }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, mb: 1 }}>
                      <strong>Type:</strong> {walletType?.toUpperCase()}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                      <strong>Address:</strong> {accountId?.slice(0, 10)}...{accountId?.slice(-8)}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    border: '1px solid rgba(255, 152, 0, 0.3)',
                    color: '#ff9800'
                  }}
                >
                  Connect your MetaMask wallet to enable document signing and verification
                </Alert>
              )}
            </Paper>

            {/* File Upload Card */}
            <Paper 
              elevation={0}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <CloudUploadIcon sx={{ color: '#0099CC', fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Upload Health Record
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box
                    sx={{
                      border: '2px dashed rgba(255, 255, 255, 0.3)',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#0099CC',
                        backgroundColor: 'rgba(0, 153, 204, 0.1)'
                      }
                    }}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept=".json,.pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <FileUploadIcon sx={{ color: '#0099CC', fontSize: 48, mb: 2 }} />
                    <Typography sx={{ color: '#fff', mb: 1, fontWeight: 500 }}>
                      {file ? file.name : 'Click to select health record'}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>
                      Supports: JSON, PDF, PNG, JPG, JPEG
                    </Typography>
                  </Box>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !file}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AssignmentTurnedInIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #00D4AA, #0099CC)',
                      color: '#fff',
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #00B894, #0088AA)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.3)'
                      }
                    }}
                  >
                    {loading ? 'Verifying...' : "Verify Health Record"}
                  </Button>
                </Box>
              </form>
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 3,
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    color: '#f44336'
                  }}
                >
                  {error}
                </Alert>
              )}
            </Paper>
          </Box>

          {/* Right Column - Results & Actions */}
          <Box sx={{ flex: { xs: '1', md: '0 0 65%' } }}>
            <Paper 
              elevation={0}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 4,
                minHeight: '600px'
              }}
            >
              {documentHash && ( 
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                    Document Hash
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                    p: 3, 
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: 14, 
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      p: 2,
                      borderRadius: 1
                    }}>
                      {documentHash}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Wallet Actions */}
              {isConnected && documentHash && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                    <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#00D4AA' }} />
                    Wallet Verification
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleWalletSign}
                        disabled={signingInProgress || walletLoading}
                        startIcon={signingInProgress ? <CircularProgress size={20} /> : <VerifiedUserIcon />}
                        sx={{
                          color: '#00D4AA',
                          borderColor: 'rgba(0, 212, 170, 0.5)',
                          py: 1.5,
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#00D4AA',
                            backgroundColor: 'rgba(0, 212, 170, 0.1)'
                          }
                        }}
                      >
                        {signingInProgress ? 'Signing...' : 'Sign Document'}
                      </Button>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleSignMessage}
                        disabled={walletLoading}
                        startIcon={<VerifiedUserIcon />}
                        sx={{
                          color: '#0099CC',
                          borderColor: 'rgba(0, 153, 204, 0.5)',
                          py: 1.5,
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#0099CC',
                            backgroundColor: 'rgba(0, 153, 204, 0.1)'
                          }
                        }}
                      >
                        Sign Message
                      </Button>
                    </Box>
                  </Box>
                  
                  {walletSignature && (
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleVerifySignature}
                          startIcon={<CheckCircleIcon />}
                          sx={{
                            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                            color: '#fff',
                            py: 1.5,
                            fontWeight: 600,
                            '&:hover': {
                              background: 'linear-gradient(45deg, #45a049, #3d8b40)',
                            }
                          }}
                        >
                          Verify Signature
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {/* Signature Display */}
                  {walletSignature && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                        Wallet Signature
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                        p: 3, 
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Typography sx={{ 
                          color: 'rgba(255, 255, 255, 0.9)', 
                          fontSize: 14, 
                          wordBreak: 'break-all',
                          fontFamily: 'monospace',
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          p: 2,
                          borderRadius: 1
                        }}>
                          {walletSignature}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Verification Status */}
                  {verificationStatus && (
                    <Box sx={{ mt: 3 }}>
                      <Chip 
                        icon={verificationStatus.verified ? <CheckCircleIcon /> : <WarningIcon />}
                        label={verificationStatus.verified ? 'Signature Verified' : 'Signature Pending Verification'}
                        sx={{ 
                          mb: 2,
                          backgroundColor: verificationStatus.verified ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                          color: verificationStatus.verified ? '#4CAF50' : '#ff9800',
                          border: verificationStatus.verified ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(255, 152, 0, 0.3)',
                          fontWeight: 600
                        }}
                      />
                      <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 2, borderRadius: 2 }}>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, mb: 1 }}>
                          <strong>Signed by:</strong> {verificationStatus.signer.slice(0, 10)}...{verificationStatus.signer.slice(-8)}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                          <strong>Time:</strong> {new Date(verificationStatus.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* AI Verification Results */}
              {result && (
                <Box>
                  <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                    <AnalyticsIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#00D4AA' }} />
                    AI Verification Results
                  </Typography>
                  
                  {/* AI Verification Summary */}
                  {result.aiVerification && (
                    <Paper sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      p: 3,
                      mb: 4
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                        {result.aiVerification.isValid ? (
                          <CheckCircleIcon sx={{ color: '#00D4AA', fontSize: 48 }} />
                        ) : (
                          <ErrorIcon sx={{ color: '#f44336', fontSize: 48 }} />
                        )}
                        <Box>
                          <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
                            {result.aiVerification.isValid ? 'Verification Passed' : 'Verification Failed'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                            <strong>Confidence:</strong> {result.aiVerification.confidence}% | 
                            <strong> Risk Level:</strong> {result.aiVerification.summary.riskLevel} |
                            <strong> Checks Passed:</strong> {result.aiVerification.summary.passedChecks}/{result.aiVerification.summary.totalChecks}
                          </Typography>
                        </Box>
                      </Box>

                      {/* AI Model Results Grid */}
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: 2, 
                        mb: 4 
                      }}>
                        <Box>
                          <Box sx={{ 
                            textAlign: 'center', 
                            p: 3, 
                            backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                            borderRadius: 2,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Typography variant="h4" sx={{ color: '#00D4AA', fontWeight: 700, mb: 1 }}>
                              {result.aiVerification.verificationMethods.llm.confidence || 0}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                              LLM Verification
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Box sx={{ 
                            textAlign: 'center', 
                            p: 3, 
                            backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                            borderRadius: 2,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Typography variant="h6" sx={{ 
                              color: result.aiVerification.verificationMethods.fraud.fraudDetected ? '#f44336' : '#00D4AA', 
                              fontWeight: 700, 
                              mb: 1 
                            }}>
                              {result.aiVerification.verificationMethods.fraud.fraudDetected ? 'FRAUD' : 'CLEAN'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                              Fraud Detection
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Box sx={{ 
                            textAlign: 'center', 
                            p: 3, 
                            backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                            borderRadius: 2,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Typography variant="h6" sx={{ 
                              color: result.aiVerification.verificationMethods.medical.medicallyValid ? '#00D4AA' : '#f44336', 
                              fontWeight: 700, 
                              mb: 1 
                            }}>
                              {result.aiVerification.verificationMethods.medical.medicallyValid ? 'VALID' : 'INVALID'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                              Medical Validation
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Box sx={{ 
                            textAlign: 'center', 
                            p: 3, 
                            backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                            borderRadius: 2,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Typography variant="h6" sx={{ 
                              color: result.aiVerification.verificationMethods.anomaly.anomaliesDetected ? '#f44336' : '#00D4AA', 
                              fontWeight: 700, 
                              mb: 1 
                            }}>
                              {result.aiVerification.verificationMethods.anomaly.anomaliesDetected ? 'ANOMALY' : 'NORMAL'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                              Anomaly Detection
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Recommendations */}
                      {result.aiVerification.summary.recommendations && result.aiVerification.summary.recommendations.length > 0 && (
                        <Box>
                          <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                            AI Recommendations
                          </Typography>
                          <List dense>
                            {result.aiVerification.summary.recommendations.map((rec, index) => (
                              <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                <ListItemIcon>
                                  <WarningIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={rec}
                                  sx={{ 
                                    '& .MuiListItemText-primary': { 
                                      color: 'rgba(255, 255, 255, 0.9)',
                                      fontSize: '14px',
                                      lineHeight: 1.5
                                    }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Paper>
                  )}

                  {/* Raw Result */}
                  <Box sx={{ 
                    background: 'rgba(0, 0, 0, 0.4)', 
                    padding: 3, 
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    mb: 3
                  }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                      Raw Verification Data
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                      p: 2, 
                      borderRadius: 2,
                      maxHeight: '300px',
                      overflow: 'auto'
                    }}>
                      <pre style={{ 
                        color: '#fff', 
                        margin: 0, 
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        lineHeight: 1.4
                      }}>
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </Box>
                  </Box>

                  {result.hashscanUrl && (
                    <Button 
                      href={result.hashscanUrl} 
                      target="_blank" 
                      rel="noopener"
                      variant="outlined"
                      startIcon={<AssignmentTurnedInIcon />}
                      sx={{
                        color: '#00D4AA',
                        borderColor: 'rgba(0, 212, 170, 0.5)',
                        py: 1.5,
                        px: 3,
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#00D4AA',
                          backgroundColor: 'rgba(0, 212, 170, 0.1)'
                        }
                      }}
                    >
                      View on HashScan
                    </Button>
                  )}
                </Box>
              )}

              {/* Empty State */}
              {!result && !loading && (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  <CloudUploadIcon sx={{ fontSize: 64, mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No Health Record Selected
                  </Typography>
                  <Typography variant="body2">
                    Upload a health record to begin verification
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
      

</Box>
    </Container>
  );
} 