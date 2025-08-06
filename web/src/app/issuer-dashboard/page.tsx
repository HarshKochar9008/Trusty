'use client'

import React, { useState } from 'react';
import {
  Container, Box, Typography, Button, Card, CardContent, TextField, Alert,
  Chip, Autocomplete, Grid, Paper, Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Nature as NatureIcon,
  Verified as VerifiedIcon,
  HealthAndSafety as HealthIcon
} from '@mui/icons-material';
import { WalletConnect } from '@/components/WalletConnect';
import { CarbonFootprintDisplay } from '@/components/CarbonFootprintDisplay';

// SDG Goals relevant to healthcare
const SDG_GOALS = [
  { id: 'SDG 1', name: 'No Poverty', description: 'End poverty in all its forms everywhere' },
  { id: 'SDG 2', name: 'Zero Hunger', description: 'End hunger, achieve food security and improved nutrition' },
  { id: 'SDG 3', name: 'Good Health and Well-being', description: 'Ensure healthy lives and promote well-being for all' },
  { id: 'SDG 4', name: 'Quality Education', description: 'Ensure inclusive and equitable quality education' },
  { id: 'SDG 5', name: 'Gender Equality', description: 'Achieve gender equality and empower all women and girls' },
  { id: 'SDG 6', name: 'Clean Water and Sanitation', description: 'Ensure availability and sustainable management of water' },
  { id: 'SDG 10', name: 'Reduced Inequalities', description: 'Reduce inequality within and among countries' },
  { id: 'SDG 11', name: 'Sustainable Cities', description: 'Make cities and human settlements inclusive, safe, resilient and sustainable' },
  { id: 'SDG 13', name: 'Climate Action', description: 'Take urgent action to combat climate change' },
  { id: 'SDG 16', name: 'Peace and Justice', description: 'Promote peaceful and inclusive societies' },
  { id: 'SDG 17', name: 'Partnerships', description: 'Strengthen the means of implementation and revitalize partnerships' }
];

// Healthcare impact tags
const HEALTH_TAGS = [
  'Vaccination', 'Rural Outreach', 'Maternal Health', 'Child Health', 'Mental Health',
  'Emergency Care', 'Preventive Care', 'Chronic Disease Management', 'Telemedicine',
  'Medical Research', 'Public Health Campaign', 'Disaster Response', 'Nutrition',
  'Sanitation', 'Medical Training', 'Equipment Donation', 'Blood Donation',
  'Organ Transplant', 'Palliative Care', 'Rehabilitation'
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
    status: 'draft'
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleAddRecord = () => {
    if (!currentRecord.patientName || !currentRecord.recordType || !currentRecord.sustainabilityTags.length || !currentRecord.sdgGoals.length) {
      setAlert({ type: 'error', message: 'Please fill in all required fields including SDG goals and sustainability tags.' });
      return;
    }

    const newRecord: HealthRecord = {
      ...currentRecord,
      id: Date.now().toString(),
      status: 'draft'
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
      status: 'draft'
    });
    setAlert({ type: 'success', message: 'Record added successfully!' });
  };

  const handleIssueRecord = (recordId: string) => {
    setRecords(records.map(record => 
      record.id === recordId ? { ...record, status: 'issued' } : record
    ));
    setAlert({ type: 'success', message: 'Record issued on blockchain successfully!' });
  };

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
              Health Record Issuer Dashboard
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontWeight: 500,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            lineHeight: 1.4,
            mb: 3,
          }}>
            Create and issue health records with sustainability tracking and SDG goal alignment
          </Typography>
          <Box sx={{ mt: 3 }}>
            <WalletConnect />
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ mb: 8 }}>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

             <Grid container spacing={4}>
         {/* Create Record Form */}
         <Grid xs={12} md={4}>
          <Card sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                <AddIcon sx={{ mr: 1, color: '#10A74A' }} />
                Create New Health Record
              </Typography>

              <TextField
                fullWidth
                label="Patient Name"
                value={currentRecord.patientName}
                onChange={(e) => setCurrentRecord({...currentRecord, patientName: e.target.value})}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Patient ID"
                value={currentRecord.patientId}
                onChange={(e) => setCurrentRecord({...currentRecord, patientId: e.target.value})}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Record Type"
                value={currentRecord.recordType}
                onChange={(e) => setCurrentRecord({...currentRecord, recordType: e.target.value})}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={currentRecord.description}
                onChange={(e) => setCurrentRecord({...currentRecord, description: e.target.value})}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Issuer Organization"
                value={currentRecord.issuer}
                onChange={(e) => setCurrentRecord({...currentRecord, issuer: e.target.value})}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Date"
                type="date"
                value={currentRecord.date}
                onChange={(e) => setCurrentRecord({...currentRecord, date: e.target.value})}
                sx={{ mb: 3 }}
              />

              {/* Sustainability Tags */}
                             <Typography variant="subtitle1" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>
                 <NatureIcon sx={{ mr: 1, color: '#10A74A' }} />
                 Sustainability Tags
               </Typography>

              <Autocomplete
                multiple
                options={HEALTH_TAGS}
                value={currentRecord.sustainabilityTags || []}
                onChange={(_, newValue) => setCurrentRecord({...currentRecord, sustainabilityTags: newValue})}
                renderInput={(params) => (
                  <TextField {...params} label="Health Impact Tags" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      sx={{ backgroundColor: '#10A74A20', color: '#10A74A' }}
                    />
                  ))
                }
                sx={{ mb: 2 }}
              />

              {/* SDG Goals */}
                             <Autocomplete
                 multiple
                 options={SDG_GOALS}
                 getOptionLabel={(option) => `${option.id} - ${option.name}`}
                 value={SDG_GOALS.filter(goal => currentRecord.sdgGoals.includes(goal.id))}
                 onChange={(_, newValue) => setCurrentRecord({...currentRecord, sdgGoals: newValue.map(g => g.id)})}
                 renderInput={(params) => (
                   <TextField {...params} label="SDG Goals" />
                 )}
                 renderTags={(value, getTagProps) =>
                   value.map((option, index) => (
                     <Chip
                       label={`${option.id} - ${option.name}`}
                       {...getTagProps({ index })}
                       sx={{ backgroundColor: '#2F52D120', color: '#2F52D1' }}
                     />
                   ))
                 }
                 sx={{ mb: 3 }}
               />

              <Button
                variant="contained"
                fullWidth
                onClick={handleAddRecord}
                sx={{
                  backgroundColor: '#10A74A',
                  '&:hover': { backgroundColor: '#0d8a3d' }
                }}
              >
                Add Record
              </Button>

              {/* Carbon Footprint Display */}
              <Box sx={{ mt: 3 }}>
                <CarbonFootprintDisplay 
                  transactionCount={records.length + 1}
                  showComparison={false}
                  compact={true}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

                 {/* Records List */}
         <Grid xs={12} md={8}>
          <Card sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                <VerifiedIcon sx={{ mr: 1, color: '#10A74A' }} />
                Health Records ({records.length})
              </Typography>

              {records.length === 0 ? (
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', py: 4 }}>
                  No records created yet. Create your first health record above.
                </Typography>
              ) : (
                <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                  {records.map((record) => (
                    <Paper key={record.id} sx={{
                      p: 3,
                      mb: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      width: '100%',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}>
                      <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                        {record.patientName} - {record.recordType}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, mb: 1 }}>
                        Issuer: {record.issuer} | Date: {record.date}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', mb: 1 }}>
                          SDG Goals:
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 0.5,
                          width: '100%'
                        }}>
                          {record.sdgGoals.map((goal) => (
                            <Chip
                              key={goal}
                              label={goal}
                              size="small"
                              sx={{ 
                                backgroundColor: '#2F52D120', 
                                color: '#2F52D1',
                                flexShrink: 0
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', mb: 1 }}>
                          Sustainability Tags:
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 0.5,
                          width: '100%'
                        }}>
                          {record.sustainabilityTags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ 
                                backgroundColor: '#10A74A20', 
                                color: '#10A74A',
                                flexShrink: 0
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1
                      }}>
                        <Chip
                          label={record.status}
                          size="small"
                          sx={{
                            backgroundColor: record.status === 'issued' ? '#10A74A20' : '#FFA50020',
                            color: record.status === 'issued' ? '#10A74A' : '#FFA500',
                            fontWeight: 600
                          }}
                        />
                        {record.status === 'draft' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleIssueRecord(record.id)}
                            sx={{ 
                              ml: 'auto',
                              borderColor: '#10A74A',
                              color: '#10A74A',
                              '&:hover': {
                                backgroundColor: 'rgba(16, 167, 74, 0.1)',
                                borderColor: '#10A74A'
                              }
                            }}
                          >
                            Issue on Blockchain
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    </Container>
  );
} 