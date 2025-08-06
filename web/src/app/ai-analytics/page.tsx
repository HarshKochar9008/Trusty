'use client'

import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Card, CardContent, 
  LinearProgress, Chip, Alert, Paper, Divider,
  List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import {
  TrendingUp, Security, HealthAndSafety, Warning,
  CheckCircle, Error, Analytics, Psychology,
  Speed, Verified, Assessment, Timeline
} from '@mui/icons-material';


interface AIAnalytics {
  totalRecords: number;
  verificationRate: number;
  fraudDetectionRate: number;
  averageConfidence: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  aiModelPerformance: {
    llm: number;
    fraud: number;
    medical: number;
    anomaly: number;
  };
  recentAnomalies: Array<{
    id: string;
    type: string;
    severity: string;
    description: string;
    timestamp: string;
  }>;
  fraudAlerts: Array<{
    id: string;
    riskLevel: string;
    description: string;
    timestamp: string;
  }>;
}

export default function AIAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AIAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration - replace with real API calls
  useEffect(() => {
    const mockAnalytics: AIAnalytics = {
      totalRecords: 15420,
      verificationRate: 94.2,
      fraudDetectionRate: 2.8,
      averageConfidence: 87.5,
      riskDistribution: {
        low: 78,
        medium: 15,
        high: 5,
        critical: 2
      },
      aiModelPerformance: {
        llm: 92,
        fraud: 89,
        medical: 95,
        anomaly: 88
      },
      recentAnomalies: [
        {
          id: '1',
          type: 'Physiological Outlier',
          severity: 'HIGH',
          description: 'Blood pressure reading outside normal range for age group',
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'Temporal Inconsistency',
          severity: 'MEDIUM',
          description: 'Treatment date precedes diagnosis date',
          timestamp: '2024-01-15T09:15:00Z'
        }
      ],
      fraudAlerts: [
        {
          id: '1',
          riskLevel: 'HIGH',
          description: 'Duplicate billing detected for same procedure',
          timestamp: '2024-01-15T11:00:00Z'
        },
        {
          id: '2',
          riskLevel: 'MEDIUM',
          description: 'Unusual treatment pattern for diagnosis',
          timestamp: '2024-01-15T08:45:00Z'
        }
      ]
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      case 'critical': return '#9c27b0';
      default: return '#757575';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="h6" sx={{ color: '#fff' }}>
            Loading AI Analytics...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
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
              AI Verification Dashboard
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontWeight: 500,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            lineHeight: 1.4,
            mb: 3,
          }}>
            Real-time insights from our multi-model AI verification system
          </Typography>
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ mb: 8 }}>

      {/* System Status Card */}
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
              System Status: Active
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Real-time insights from our multi-model AI verification system
          </Typography>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          height: '100%'
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Analytics sx={{ fontSize: 40, color: '#00D4AA', mb: 2 }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
              {analytics?.totalRecords.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Total Records Processed
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          height: '100%'
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Verified sx={{ fontSize: 40, color: '#4caf50', mb: 2 }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
              {analytics?.verificationRate}%
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Verification Success Rate
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          height: '100%'
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Security sx={{ fontSize: 40, color: '#ff9800', mb: 2 }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
              {analytics?.fraudDetectionRate}%
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Fraud Detection Rate
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          height: '100%'
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Psychology sx={{ fontSize: 40, color: '#2F52D1', mb: 2 }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
              {analytics?.averageConfidence}%
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Average AI Confidence
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 4 
      }}>
        {/* AI Model Performance */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          height: '100%'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Assessment sx={{ color: '#fff' }} />
              <Typography variant="h6" sx={{ color: '#fff' }}>
                AI Model Performance
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  LLM Verification
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                  {analytics?.aiModelPerformance.llm}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analytics?.aiModelPerformance.llm || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#00D4AA'
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Fraud Detection
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                  {analytics?.aiModelPerformance.fraud}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analytics?.aiModelPerformance.fraud || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ff9800'
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Medical Validation
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                  {analytics?.aiModelPerformance.medical}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analytics?.aiModelPerformance.medical || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4caf50'
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Anomaly Detection
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                  {analytics?.aiModelPerformance.anomaly}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analytics?.aiModelPerformance.anomaly || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#2F52D1'
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          height: '100%'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Timeline sx={{ color: '#fff' }} />
              <Typography variant="h6" sx={{ color: '#fff' }}>
                Risk Distribution
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Low Risk
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                  {analytics?.riskDistribution.low}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analytics?.riskDistribution.low || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4caf50'
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Medium Risk
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                  {analytics?.riskDistribution.medium}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analytics?.riskDistribution.medium || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ff9800'
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  High Risk
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                  {analytics?.riskDistribution.high}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analytics?.riskDistribution.high || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#f44336'
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Critical Risk
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                  {analytics?.riskDistribution.critical}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analytics?.riskDistribution.critical || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#9c27b0'
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Recent Anomalies */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          height: '100%'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Warning sx={{ color: '#fff' }} />
              <Typography variant="h6" sx={{ color: '#fff' }}>
                Recent Anomalies
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {analytics?.recentAnomalies.map((anomaly, index) => (
                <React.Fragment key={anomaly.id}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Warning sx={{ color: getSeverityColor(anomaly.severity) }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                            {anomaly.type}
                          </Typography>
                          <Chip 
                            label={anomaly.severity} 
                            size="small"
                            sx={{ 
                              backgroundColor: getSeverityColor(anomaly.severity),
                              color: '#fff',
                              fontSize: '0.7rem',
                              height: 20
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                            {anomaly.description}
                          </Typography>
                          <Typography component="span" variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
                            {new Date(anomaly.timestamp).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < analytics.recentAnomalies.length - 1 && (
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Fraud Alerts */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          height: '100%'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Security sx={{ color: '#fff' }} />
              <Typography variant="h6" sx={{ color: '#fff' }}>
                Fraud Alerts
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {analytics?.fraudAlerts.map((alert, index) => (
                <React.Fragment key={alert.id}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Security sx={{ color: getRiskColor(alert.riskLevel) }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                            Fraud Alert
                          </Typography>
                          <Chip 
                            label={alert.riskLevel} 
                            size="small"
                            sx={{ 
                              backgroundColor: getRiskColor(alert.riskLevel),
                              color: '#fff',
                              fontSize: '0.7rem',
                              height: 20
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                            {alert.description}
                          </Typography>
                          <Typography component="span" variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
                            {new Date(alert.timestamp).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < analytics.fraudAlerts.length - 1 && (
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
      </Box>
    </Container>
  );
} 