'use client'
import React, { useState } from 'react';
import {
  Container, Box, Typography, Button, Card
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';

import { ArrowDown } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScrollDown = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('record', file);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Failed to verify record.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ 
        position: 'relative',
        mb: 8,
        mt: 4,
        minHeight: '50vh'
      }}>
                   <Box sx={{ 
           position: 'relative',
           zIndex: 2,
           maxWidth: { xs: '100%', lg: '60%' },
           textAlign: { xs: 'center', lg: 'left' },
           top: 100,
           left: -120,
           display: 'flex',
           flexDirection: 'column',
           height: '100%',
           marginBottom: 100
         }}>
          <Typography variant="h1" sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: '4.5rem', md: '5rem', lg: '5rem' },
            lineHeight: 1.1
          }}>
            <Box component="span" sx={{ 
              background: 'linear-gradient(135deg, #10A74A 0%,rgb(71, 111, 255) 100%)',
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Hedera Trusty
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontWeight: 500,
            fontSize: { xs: '1.5rem', md: '1.5rem' },
            lineHeight: 1.4,
            mb: 3,
          }}>
            Secure health record verification powered by <br/> AI & Hedera Hashgraph
          </Typography>
        </Box>
        <Box sx={{ 
          position: 'absolute',
          top: 50,
          right: { xs: 0, lg: -10 },
          width: { xs: '100%', lg: '60%' },
          height: '100%',
          display: 'flex',
          justifyContent: { xs: 'center', lg: 'flex-end' },
          alignItems: 'center',
          zIndex: 1
        }}>
                       <img 
             src="/DNA.png" 
             alt="DNA Helix" 
             style={{ 
               maxWidth: '800px',
               height: 'auto',
               filter: 'drop-shadow(0 8px 32px rgba(16, 167, 74, 0.3))',
                animation: 'dnaFloat 6s ease-in-out infinite, dnaRotate 20s linear infinite, dnaGlow 4s ease-in-out infinite',
                animationDelay: '0.5s',
               transform: 'translateX(25%) translateY(-1%)',
               transformOrigin: 'center'
             }} 
           />
                   </Box>
       </Box>
      {/* Scroll Down Arrow */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 6
      }}>
        <Button
          onClick={handleScrollDown}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 'auto',
            minHeight: 'auto',
            padding: 1.5,
            position: 'relative',
            top: 60,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.6)',
            transition: 'all 0.2s ease',
                           animation: 'arrowUpDown 2s ease-in-out infinite',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#10A74A',
              color: '#10A74A',
              animation: 'none'
            }
          }}
          aria-label="Scroll down"
        >
          <ArrowDown size={20} />
        </Button>
      </Box>
      
      <Box id="features-section" sx={{ mb: 8, mt: 12 }}>
        <Typography variant="h3" sx={{ 
          textAlign: 'center', 
          mb: 6,
          mt: 8,
          fontWeight: 600,
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}>
          Why Choose Hedera Trusty?
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
          gap: 4 
        }}>
          {[
            {
              icon: <SecurityIcon sx={{ fontSize: 36, color: '#10A74A' }} />,
              title: 'Blockchain Security',
              description: 'Leverage Hedera Hashgraph\'s enterprise-grade security with Byzantine fault tolerance and instant finality.'
            },
            {
              icon: <SpeedIcon sx={{ fontSize: 36, color: '#2F52D1' }} />,
              title: 'AI-Powered Verification',
              description: 'Advanced AI algorithms ensure accurate and fast verification of health records with 99.9% accuracy.'
            },
            {
              icon: <VerifiedIcon sx={{ fontSize: 36, color: '#00D4AA' }} />,
              title: 'Real-time Processing',
              description: 'Process thousands of records per second with real-time verification and instant blockchain confirmation.'
            }
          ].map((feature, index) => (
            <Card key={index} sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              p: 4,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#10A74A',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}>
              <Box sx={{ mb: 3 }}>
                {feature.icon}
              </Box>
              <Typography variant="h6" sx={{ 
                color: '#fff', 
                mb: 2,
                fontWeight: 600
              }}>
                {feature.title}
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: 15,
                lineHeight: 1.6
              }}>
                {feature.description}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>
      
      {/* Statistics */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ 
          textAlign: 'center', 
          mb: 6,
          fontWeight: 600,
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}>
          Platform Statistics
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, 
          gap: 3 
        }}>
          {[
            { value: '2.5k+', label: 'Records Verified', color: '#00D4AA' },
            { value: '98.9%', label: 'Accuracy Rate', color: '#10A74A' },
            { value: '<2s', label: 'Average Processing', color: '#2F52D1' },
            { value: '100+', label: 'Healthcare Partners', color: '#FFA500' }
          ].map((stat, index) => (
            <Card key={index} sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              p: 3,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: stat.color,
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}>
              <Typography variant="h3" sx={{ 
                color: stat.color, 
                fontWeight: 700, 
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                {stat.value}
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: 16 
              }}>
                {stat.label}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

            {/* Sustainability Features */}
            <Box sx={{ mb: 8 }}>
              <Typography variant="h3" sx={{
                textAlign: 'center',
                mb: 6,
                fontWeight: 600,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                Sustainability Features
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 4
              }}>
                {[
                  {
                    icon: <VerifiedIcon sx={{ fontSize: 36, color: '#10A74A' }} />,
                    title: 'SDG Goal Tracking',
                    description: 'Track health records against UN Sustainable Development Goals for transparent impact measurement.'
                  },
                  {
                    icon: <SpeedIcon sx={{ fontSize: 36, color: '#2F52D1' }} />,
                    title: 'Carbon Footprint',
                    description: 'Minimal energy consumption with Hedera Hashgraph - 99.9% more efficient than traditional blockchains.'
                  },
                  {
                    icon: <VerifiedIcon sx={{ fontSize: 36, color: '#00D4AA' }} />,
                    title: 'Guardian Integration',
                    description: 'Simple Guardian framework integration for policy management and compliance.'
                  }
                ].map((feature, index) => (
                  <Card key={index} sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                    p: 4,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#10A74A',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}>
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{
                      color: '#fff',
                      mb: 2,
                      fontWeight: 600
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: 15,
                      lineHeight: 1.6
                    }}>
                      {feature.description}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Box>
    </Container>
  );
}
