'use client'

import React from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Grid, Tooltip,
  LinearProgress, Divider
} from '@mui/material';
import {
  Nature as NatureIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';

interface CarbonFootprintData {
  blockchain: string;
  energyPerTx: number; 
  carbonPerTx: number; 
  tps: number; 
  color: string;
  description: string;
}

const BLOCKCHAIN_DATA: CarbonFootprintData[] = [
  {
    blockchain: 'Hedera',
    energyPerTx: 0.00000122,
    carbonPerTx: 0.0000006,
    tps: 10000,
    color: '#10A74A',
    description: 'Enterprise-grade DLT with minimal energy consumption'
  },
  {
    blockchain: 'Ethereum',
    energyPerTx: 0.0006,
    carbonPerTx: 0.0003,
    tps: 15,
    color: '#F6851B',
    description: 'Proof of Stake, but still higher energy consumption'
  },
  {
    blockchain: 'Bitcoin',
    energyPerTx: 0.0007,
    carbonPerTx: 0.00035,
    tps: 7,
    color: '#F7931A',
    description: 'Proof of Work with high energy requirements'
  },
  {
    blockchain: 'Solana',
    energyPerTx: 0.00000051,
    carbonPerTx: 0.00000025,
    tps: 65000,
    color: '#9945FF',
    description: 'High performance but centralized'
  }
];

interface CarbonFootprintDisplayProps {
  transactionCount?: number;
  showComparison?: boolean;
  compact?: boolean;
}

export const CarbonFootprintDisplay: React.FC<CarbonFootprintDisplayProps> = ({
  transactionCount = 1,
  showComparison = true,
  compact = false
}) => {
  const hederaData = BLOCKCHAIN_DATA.find(data => data.blockchain === 'Hedera')!;
  
  const calculateEfficiency = (data: CarbonFootprintData) => {
    const totalEnergy = data.energyPerTx * transactionCount;
    const totalCarbon = data.carbonPerTx * transactionCount;
    return { totalEnergy, totalCarbon };
  };

  const hederaEfficiency = calculateEfficiency(hederaData);
  
  const getEfficiencyPercentage = (data: CarbonFootprintData) => {
    const hederaEnergy = hederaData.energyPerTx;
    const otherEnergy = data.energyPerTx;
    return ((hederaEnergy / otherEnergy) * 100).toFixed(2);
  };

  if (compact) {
    return (
      <Card sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <NatureIcon sx={{ color: '#10A74A', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600 }}>
              Carbon Footprint
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Energy: {hederaEfficiency.totalEnergy.toFixed(8)} kWh
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>
                CO₂: {hederaEfficiency.totalCarbon.toFixed(8)} kg
              </Typography>
            </Box>
            <Chip
              label="Hedera"
              size="small"
              sx={{ 
                backgroundColor: '#10A74A20',
                color: '#10A74A',
                fontSize: '10px'
              }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Hedera Efficiency Display */}
      <Card sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        mb: showComparison ? 3 : 0
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <NatureIcon sx={{ color: '#10A74A', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                Carbon Footprint Efficiency
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Environmental impact for {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'rgba(16, 167, 74, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(16, 167, 74, 0.2)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BoltIcon sx={{ color: '#10A74A', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600 }}>
                    Energy Consumption
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#10A74A', fontWeight: 700, mb: 1 }}>
                  {hederaEfficiency.totalEnergy.toFixed(8)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  kilowatt-hours (kWh)
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'rgba(16, 167, 74, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(16, 167, 74, 0.2)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUpIcon sx={{ color: '#10A74A', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600 }}>
                    Carbon Emissions
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#10A74A', fontWeight: 700, mb: 1 }}>
                  {hederaEfficiency.totalCarbon.toFixed(8)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  kilograms CO₂
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
              <strong>Hedera Hashgraph</strong> uses a consensus mechanism that requires minimal computational power, 
              making it one of the most energy-efficient distributed ledger technologies available.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Blockchain Comparison */}
      {showComparison && (
        <Card sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 3 }}>
              Energy Efficiency Comparison
            </Typography>

            <Grid container spacing={2}>
              {BLOCKCHAIN_DATA.map((data, index) => {
                const efficiency = calculateEfficiency(data);
                const efficiencyPercentage = getEfficiencyPercentage(data);
                const isHedera = data.blockchain === 'Hedera';
                
                return (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: isHedera ? 'rgba(16, 167, 74, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 2,
                      border: `1px solid ${isHedera ? 'rgba(16, 167, 74, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                      position: 'relative'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            backgroundColor: data.color 
                          }} />
                          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                            {data.blockchain}
                          </Typography>
                          {isHedera && (
                            <Chip
                              label="Most Efficient"
                              size="small"
                              sx={{ 
                                backgroundColor: '#10A74A20',
                                color: '#10A74A',
                                fontSize: '10px'
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {data.tps.toLocaleString()} TPS
                        </Typography>
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Energy per tx
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                            {data.energyPerTx.toFixed(8)} kWh
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            CO₂ per tx
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                            {data.carbonPerTx.toFixed(8)} kg
                          </Typography>
                        </Grid>
                      </Grid>

                      {!isHedera && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Hedera is {efficiencyPercentage}% more efficient
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={parseFloat(efficiencyPercentage)}
                            sx={{
                              mt: 1,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#10A74A'
                              }
                            }}
                          />
                        </Box>
                      )}

                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mt: 1 }}>
                        {data.description}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box sx={{ p: 2, backgroundColor: 'rgba(16, 167, 74, 0.05)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
                <strong>Environmental Impact:</strong> Hedera's energy-efficient consensus mechanism makes it 
                the preferred choice for sustainable blockchain applications, reducing carbon footprint by 
                up to 99.9% compared to traditional proof-of-work systems.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}; 