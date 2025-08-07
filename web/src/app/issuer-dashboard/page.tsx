'use client'

import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, Card, CardContent, TextField, Alert,
  Chip, Autocomplete, Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Nature as NatureIcon,
  Verified as VerifiedIcon,
  HealthAndSafety as HealthIcon,
      TrendingUp, Analytics, Timeline, Assessment,
      Psychology, LocalHospital, School,
  Work, Elderly, ChildCare, Emergency 
} from '@mui/icons-material';
import { WalletConnect } from '@/components/WalletConnect';
import { motion } from 'framer-motion';

// SDG Goals relevant to healthcare
const SDG_GOALS = [
  { id: 'SDG 1', name: 'No Poverty', description: 'End poverty in all its forms everywhere', icon: <TrendingUp /> },
  { id: 'SDG 3', name: 'Good Health and Well-being', description: 'Ensure healthy lives and promote well-being for all', icon: <HealthIcon /> },
  { id: 'SDG 4', name: 'Quality Education', description: 'Ensure inclusive and equitable quality education', icon: <School /> },
  { id: 'SDG 5', name: 'Gender Equality', description: 'Achieve gender equality and empower all women and girls', icon: <Psychology /> },
  { id: 'SDG 6', name: 'Clean Water and Sanitation', description: 'Ensure availability and sustainable management of water', icon: <NatureIcon /> },
  { id: 'SDG 10', name: 'Reduced Inequalities', description: 'Reduce inequality within and among countries', icon: <Assessment /> },
  { id: 'SDG 11', name: 'Sustainable Cities', description: 'Make cities and human settlements inclusive, safe, resilient and sustainable', icon: <Work /> },
  { id: 'SDG 13', name: 'Climate Action', description: 'Take urgent action to combat climate change', icon: <NatureIcon /> },
  { id: 'SDG 16', name: 'Peace and Justice', description: 'Promote peaceful and inclusive societies', icon: <VerifiedIcon /> },
  { id: 'SDG 17', name: 'Partnerships', description: 'Strengthen the means of implementation and revitalize partnerships', icon: <Analytics /> }
];

// Healthcare impact tags with icons
const HEALTH_TAGS = [
  { name: 'Vaccination', icon: <HealthIcon />, color: '#10A74A' },
  { name: 'Rural Outreach', icon: <NatureIcon />, color: '#2F52D1' },
  { name: 'Child Health', icon: <ChildCare />, color: '#FFA500' },
  { name: 'Mental Health', icon: <Psychology />, color: '#9C27B0' },
  { name: 'Emergency Care', icon: <LocalHospital />, color: '#F44336' },
  { name: 'Preventive Care', icon: <HealthIcon />, color: '#4CAF50' },
  { name: 'Chronic Disease Management', icon: <Timeline />, color: '#FF9800' },
  { name: 'Telemedicine', icon: <Analytics />, color: '#2196F3' },
  { name: 'Medical Research', icon: <Assessment />, color: '#673AB7' },
  { name: 'Public Health Campaign', icon: <TrendingUp />, color: '#00BCD4' },
  { name: 'Disaster Response', icon: <Emergency />, color: '#E91E63' },
  { name: 'Sanitation', icon: <NatureIcon />, color: '#795548' },
  { name: 'Medical Training', icon: <School />, color: '#607D8B' },
  { name: 'Equipment Donation', icon: <HealthIcon />, color: '#9E9E9E' },
  { name: 'Blood Donation', icon: <HealthIcon />, color: '#F44336' },
  { name: 'Organ Transplant', icon: <HealthIcon />, color: '#4CAF50' },
  { name: 'Palliative Care', icon: <Elderly />, color: '#FF5722' },
  { name: 'Rehabilitation', icon: <HealthIcon />, color: '#009688' }
];

interface HealthRecord {
  id: string;
  patientName: string;
  patientId: string;
  recordType: string;
  description: string;
  issuer: string;
  date: string;
  sustainabilityTags: string[];
  sdgGoals: string[];
  status: 'draft' | 'issued';
  impactScore?: number;
  transactionId?: string;
  hashscanUrl?: string;
  consensusTimestamp?: string;
}

interface DashboardStats {
  totalRecords: number;
  issuedRecords: number;
  draftRecords: number;
  avgImpactScore: number;
  topSdgGoal: string;
  topHealthTag: string;
}

export default function IssuerDashboard() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<HealthRecord>({
    id: '',
    patientName: '',
    patientId: '',
    recordType: '',
    description: '',
    issuer: '',
    date: new Date().toISOString().split('T')[0],
    sustainabilityTags: [],
    sdgGoals: [],
    status: 'draft',
    impactScore: 0
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalRecords: 0,
    issuedRecords: 0,
    draftRecords: 0,
    avgImpactScore: 0,
    topSdgGoal: '',
    topHealthTag: ''
  });

  // Calculate dashboard statistics
  useEffect(() => {
    const totalRecords = records.length;
    const issuedRecords = records.filter(r => r.status === 'issued').length;
    const draftRecords = records.filter(r => r.status === 'draft').length;
    const avgImpactScore = records.length > 0 
      ? records.reduce((sum, r) => sum + (r.impactScore || 0), 0) / records.length 
      : 0;

    // Calculate top SDG goal
    const sdgCounts: { [key: string]: number } = {};
    records.forEach(record => {
      record.sdgGoals.forEach(goal => {
        sdgCounts[goal] = (sdgCounts[goal] || 0) + 1;
      });
    });
    const topSdgGoal = Object.keys(sdgCounts).reduce((a, b) => 
      sdgCounts[a] > sdgCounts[b] ? a : b, '');

    // Calculate top health tag
    const tagCounts: { [key: string]: number } = {};
    records.forEach(record => {
      record.sustainabilityTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topHealthTag = Object.keys(tagCounts).reduce((a, b) => 
      tagCounts[a] > tagCounts[b] ? a : b, '');

    setStats({
      totalRecords,
      issuedRecords,
      draftRecords,
      avgImpactScore,
      topSdgGoal,
      topHealthTag
    });
  }, [records]);

  const calculateImpactScore = (sdgGoals: string[], tags: string[]): number => {
    // Simple impact scoring algorithm
    const sdgScore = sdgGoals.length * 10;
    const tagScore = tags.length * 5;
    const baseScore = 50;
    return Math.min(100, baseScore + sdgScore + tagScore);
  };

  const handleAddRecord = () => {
    if (!currentRecord.patientName || !currentRecord.recordType || !currentRecord.sustainabilityTags.length || !currentRecord.sdgGoals.length) {
      setAlert({ type: 'error', message: 'Please fill in all required fields including SDG goals and sustainability tags.' });
      return;
    }

    const impactScore = calculateImpactScore(currentRecord.sdgGoals, currentRecord.sustainabilityTags);

    const newRecord: HealthRecord = {
      ...currentRecord,
      id: Date.now().toString(),
      status: 'draft',
      impactScore
    };

    setRecords([...records, newRecord]);
    setCurrentRecord({
      id: '',
      patientName: '',
      patientId: '',
      recordType: '',
      description: '',
      issuer: '',
      date: new Date().toISOString().split('T')[0],
      sustainabilityTags: [],
      sdgGoals: [],
      status: 'draft',
      impactScore: 0
    });
    setAlert({ type: 'success', message: 'Record added successfully!' });
  };

  const handleIssueRecord = async (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    try {
      setAlert({ type: 'success', message: 'Issuing record on blockchain...' });
      
      const response = await fetch('/api/issue-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: record.patientName,
          patientId: record.patientId,
          recordType: record.recordType,
          description: record.description,
          issuer: record.issuer,
          date: record.date,
          sustainabilityTags: record.sustainabilityTags,
          sdgGoals: record.sdgGoals,
          impactScore: record.impactScore
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the record with blockchain details
        setRecords(records.map(r => 
          r.id === recordId ? { 
            ...r, 
            status: 'issued',
            transactionId: result.record.transactionId,
            hashscanUrl: result.record.hashscanUrl,
            consensusTimestamp: result.record.consensusTimestamp
          } : r
        ));
        setAlert({ 
          type: 'success', 
          message: `Record issued on blockchain successfully! Transaction ID: ${result.record.transactionId}` 
        });
      } else {
        setAlert({ type: 'error', message: result.error || 'Failed to issue record on blockchain' });
      }
    } catch (error) {
      console.error('Error issuing record:', error);
      setAlert({ type: 'error', message: 'Failed to issue record on blockchain' });
    }
  };

  const getSdgGoalInfo = (goalId: string) => {
    return SDG_GOALS.find(goal => goal.id === goalId);
  };

  const getHealthTagInfo = (tagName: string) => {
    return HEALTH_TAGS.find(tag => tag.name === tagName);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
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
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
              lineHeight: 1.1,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              letterSpacing: '-0.02em'
            }}>
              <Box component="span" sx={{ 
                background: 'linear-gradient(135deg, #10A74A 0%, #2F52D1 50%, #00D4AA 100%)',
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Health Record Issuer Dashboard
              </Box>
            </Typography>
            <Typography variant="h5" sx={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontWeight: 400,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              lineHeight: 1.4,
              mb: 3,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            }}>
              Create and issue health records with sustainability tracking and SDG goal alignment
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Dashboard Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 6 }}>
          {[
            { 
              title: 'Total Records', 
              value: stats.totalRecords, 
              icon: <HealthIcon />, 
              color: '#10A74A',
              subtitle: 'Created records'
            },
            { 
              title: 'Issued Records', 
              value: stats.issuedRecords, 
              icon: <VerifiedIcon />, 
              color: '#2F52D1',
              subtitle: 'On blockchain'
            },
            { 
              title: 'Draft Records', 
              value: stats.draftRecords, 
              icon: <AddIcon />, 
              color: '#FFA500',
              subtitle: 'Pending issuance'
            },
            { 
              title: 'Avg Impact Score', 
              value: `${stats.avgImpactScore.toFixed(1)}%`, 
              icon: <TrendingUp />, 
              color: '#00D4AA',
              subtitle: 'Sustainability impact'
            }
          ].map((stat, index) => (
            <Box key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  p: 3,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: stat.color,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 32px ${stat.color}20`
                  }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: `${stat.color}20`,
                      color: stat.color
                    }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography variant="h3" sx={{ 
                    color: stat.color, 
                    fontWeight: 700,
                    mb: 1,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#fff', 
                    fontWeight: 600,
                    mb: 1,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}>
                    {stat.subtitle}
                  </Typography>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>
      </motion.div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Box sx={{ mb: 8 }}>
          {alert && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <Alert severity={alert.type} sx={{ mb: 3 }}>
                {alert.message}
              </Alert>
            </motion.div>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 4 }}>
            {/* Create Record Form */}
            <Box>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Card sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  height: 'fit-content'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#fff', 
                      mb: 3, 
                      fontWeight: 700,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <AddIcon sx={{ color: '#10A74A' }} />
                      Create New Health Record
                    </Typography>

                    <TextField
                      fullWidth
                      label="Patient Name"
                      value={currentRecord.patientName}
                      onChange={(e) => setCurrentRecord({...currentRecord, patientName: e.target.value})}
                      sx={{ mb: 2 }}
                      InputProps={{
                        sx: {
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          borderRadius: '8px',
                          '& .MuiInputBase-input': {
                            color: '#fff'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          color: '#bfbfbf',
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Patient ID"
                      value={currentRecord.patientId}
                      onChange={(e) => setCurrentRecord({...currentRecord, patientId: e.target.value})}
                      sx={{ mb: 2 }}
                      InputProps={{
                        sx: {
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          borderRadius: '8px',
                          '& .MuiInputBase-input': {
                            color: '#fff'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          color: '#bfbfbf',
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Record Type"
                      value={currentRecord.recordType}
                      onChange={(e) => setCurrentRecord({...currentRecord, recordType: e.target.value})}
                      sx={{ mb: 2 }}
                      InputProps={{
                        sx: {
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          borderRadius: '8px',
                          '& .MuiInputBase-input': {
                            color: '#fff'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          color: '#bfbfbf',
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={3}
                      value={currentRecord.description}
                      onChange={(e) => setCurrentRecord({...currentRecord, description: e.target.value})}
                      sx={{ mb: 2 }}
                      InputProps={{
                        sx: {
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          borderRadius: '8px',
                          '& .MuiInputBase-input': {
                            color: '#fff'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          color: '#bfbfbf',
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Issuer Organization"
                      value={currentRecord.issuer}
                      onChange={(e) => setCurrentRecord({...currentRecord, issuer: e.target.value})}
                      sx={{ mb: 2 }}
                      InputProps={{
                        sx: {
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          borderRadius: '8px',
                          '& .MuiInputBase-input': {
                            color: '#fff'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          color: '#bfbfbf',
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      value={currentRecord.date}
                      onChange={(e) => setCurrentRecord({...currentRecord, date: e.target.value})}
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: {
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          borderRadius: '8px',
                          '& .MuiInputBase-input': {
                            color: '#fff'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          color: '#bfbfbf',
                        }
                      }}
                    />

                    {/* Sustainability Tags */}
                    <Typography variant="subtitle1" sx={{ 
                      mb: 2, 
                      color: '#fff', 
                      fontWeight: 600,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <NatureIcon sx={{ color: '#10A74A' }} />
                      Sustainability Tags
                    </Typography>

                    <Autocomplete
                      multiple
                      options={HEALTH_TAGS}
                      getOptionLabel={(option) => option.name}
                      value={HEALTH_TAGS.filter(tag => currentRecord.sustainabilityTags.includes(tag.name))}
                      onChange={(_, newValue) => setCurrentRecord({
                        ...currentRecord, 
                        sustainabilityTags: newValue.map(v => v.name)
                      })}
                                              renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Health Impact Tags" 
                            InputProps={{
                              ...params.InputProps,
                              sx: {
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                borderRadius: '8px',
                                '& .MuiInputBase-input': {
                                  color: '#fff'
                                }
                              }
                            }}
                            InputLabelProps={{
                              sx: {
                                color: '#bfbfbf',
                              }
                            }}
                          />
                        )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...chipProps } = getTagProps({ index });
                          return (
                            <Chip
                              key={key}
                              label={option.name}
                              {...chipProps}
                              sx={{ 
                                backgroundColor: `${option.color}20`, 
                                color: option.color,
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                              }}
                            />
                          );
                        })
                      }
                      sx={{ mb: 2 }}
                    />

                    {/* SDG Goals */}
                    <Autocomplete
                      multiple
                      options={SDG_GOALS}
                      getOptionLabel={(option) => `${option.id} - ${option.name}`}
                      value={SDG_GOALS.filter(goal => currentRecord.sdgGoals.includes(goal.id))}
                      onChange={(_, newValue) => setCurrentRecord({
                        ...currentRecord, 
                        sdgGoals: newValue.map(g => g.id)
                      })}
                                              renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="SDG Goals" 
                            InputProps={{
                              ...params.InputProps,
                              sx: {
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                borderRadius: '8px',
                                '& .MuiInputBase-input': {
                                  color: '#fff'
                                }
                              }
                            }}
                            InputLabelProps={{
                              sx: {
                                color: '#bfbfbf',
                              }
                            }}
                          />
                        )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...chipProps } = getTagProps({ index });
                          return (
                            <Chip
                              key={key}
                              label={`${option.id} - ${option.name}`}
                              {...chipProps}
                              sx={{ 
                                backgroundColor: '#2F52D120', 
                                color: '#2F52D1',
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                              }}
                            />
                          );
                        })
                      }
                      sx={{ mb: 3 }}
                    />

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleAddRecord}
                      sx={{
                        backgroundColor: '#10A74A',
                        borderRadius: '12px',
                        py: 1.5,
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': { 
                          backgroundColor: '#0d8a3d',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(16, 167, 74, 0.3)'
                        }
                      }}
                    >
                      Add Record
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            {/* Records List */}
            <Box>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Card sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#fff', 
                      mb: 3, 
                      fontWeight: 700,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <VerifiedIcon sx={{ color: '#10A74A' }} />
                      Health Records ({records.length})
                    </Typography>

                    {records.length === 0 ? (
                      <Typography sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)', 
                        textAlign: 'center', 
                        py: 4,
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}>
                        No records created yet. Create your first health record above.
                      </Typography>
                    ) : (
                      <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                        {records.map((record, index) => (
                          <motion.div
                            key={record.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Paper sx={{
                              p: 3,
                              mb: 3,
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              borderRadius: '12px',
                              width: '100%',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                              }
                            }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                  <Typography variant="h6" sx={{ 
                                    color: '#fff', 
                                    fontWeight: 700,
                                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                  }}>
                                    {record.patientName} - {record.recordType}
                                  </Typography>
                                  <Typography sx={{ 
                                    color: 'rgba(255, 255, 255, 0.7)', 
                                    fontSize: 14, 
                                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                  }}>
                                    Issuer: {record.issuer} | Date: {record.date}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {record.impactScore && (
                                    <Chip
                                      label={`${record.impactScore}% Impact`}
                                      size="small"
                                      sx={{
                                        backgroundColor: 'rgba(0, 212, 170, 0.2)',
                                        color: '#00D4AA',
                                        fontWeight: 600,
                                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                      }}
                                    />
                                  )}
                                  <Chip
                                    label={record.status}
                                    size="small"
                                    sx={{
                                      backgroundColor: record.status === 'issued' ? 'rgba(16, 167, 74, 0.2)' : 'rgba(255, 165, 0, 0.2)',
                                      color: record.status === 'issued' ? '#10A74A' : '#FFA500',
                                      fontWeight: 600,
                                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                    }}
                                  />
                                </Box>
                              </Box>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ 
                                  color: 'rgba(255, 255, 255, 0.6)', 
                                  display: 'block', 
                                  mb: 1,
                                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                }}>
                                  SDG Goals:
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: 0.5,
                                  width: '100%'
                                }}>
                                  {record.sdgGoals.map((goal, index) => {
                                    const goalInfo = getSdgGoalInfo(goal);
                                    return (
                                      <Chip
                                        key={`${goal}-${index}`}
                                        label={goal}
                                        size="small"
                                        icon={goalInfo?.icon}
                                        sx={{ 
                                          backgroundColor: '#2F52D120', 
                                          color: '#2F52D1',
                                          flexShrink: 0,
                                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                        }}
                                      />
                                    );
                                  })}
                                </Box>
                              </Box>

                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ 
                                  color: 'rgba(255, 255, 255, 0.6)', 
                                  display: 'block', 
                                  mb: 1,
                                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                }}>
                                  Sustainability Tags:
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: 0.5,
                                  width: '100%'
                                }}>
                                  {record.sustainabilityTags.map((tag, index) => {
                                    const tagInfo = getHealthTagInfo(tag);
                                    return (
                                      <Chip
                                        key={`${tag}-${index}`}
                                        label={tag}
                                        size="small"
                                        icon={tagInfo?.icon}
                                        sx={{ 
                                          backgroundColor: `${tagInfo?.color || '#10A74A'}20`, 
                                          color: tagInfo?.color || '#10A74A',
                                          flexShrink: 0,
                                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                        }}
                                      />
                                    );
                                  })}
                                </Box>
                              </Box>

                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 1
                              }}>
                                {record.status === 'draft' && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleIssueRecord(record.id)}
                                    sx={{ 
                                      ml: 'auto',
                                      borderColor: '#10A74A',
                                      color: '#10A74A',
                                      borderRadius: '8px',
                                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                      fontWeight: 600,
                                      '&:hover': {
                                        backgroundColor: 'rgba(16, 167, 74, 0.1)',
                                        borderColor: '#10A74A',
                                        transform: 'translateY(-1px)'
                                      }
                                    }}
                                  >
                                    Issue on Blockchain
                                  </Button>
                                )}
                                {record.status === 'issued' && record.transactionId && (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                                    <Typography variant="caption" sx={{ 
                                      color: 'rgba(255, 255, 255, 0.6)',
                                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                    }}>
                                      Blockchain Transaction:
                                    </Typography>
                                    <Typography variant="caption" sx={{ 
                                      color: '#10A74A',
                                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                      fontWeight: 600,
                                      wordBreak: 'break-all'
                                    }}>
                                      {record.transactionId}
                                    </Typography>
                                    {record.hashscanUrl && (
                                      <Button
                                        size="small"
                                        variant="text"
                                        href={record.hashscanUrl}
                                        target="_blank"
                                        sx={{ 
                                          color: '#2F52D1',
                                          fontSize: '10px',
                                          p: 0,
                                          minWidth: 'auto',
                                          textTransform: 'none',
                                          '&:hover': {
                                            textDecoration: 'underline'
                                          }
                                        }}
                                      >
                                        View on HashScan →
                                      </Button>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            </Paper>
                          </motion.div>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
} 