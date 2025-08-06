import { Container, Card, CardContent, Typography, Box } from '@mui/material';

export default function AboutPage() {
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
              About Hedera Trusty
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontWeight: 500,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            lineHeight: 1.4,
            mb: 3,
          }}>
            Next-generation health record verification platform powered by AI & blockchain
          </Typography>
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ mb: 8 }}>
        <Card sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '800px',
          mx: 'auto'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
              <img src="/logo.png" alt="Hedera Trusty" width={40} height={40} />
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                Hedera Trusty
              </Typography>
            </Box>
            
            <Typography sx={{ color: '#fff', fontSize: 18, mb: 4, lineHeight: 1.6 }}>
              Hedera Trusty is a next-generation platform for verifying and timestamping health records on the Hedera Hashgraph network. We combine AI-powered verification with the security and transparency of distributed ledger technology.
            </Typography>
            
            <Box sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              padding: 3, 
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              mb: 3
            }}>
              <Typography sx={{ color: '#fff', fontSize: 16, mb: 2, fontWeight: 600 }}>
                Our Mission
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 16, lineHeight: 1.5 }}>
                Empower individuals and organizations to trust, share, and prove health data securely and efficiently, anywhere in the world.
              </Typography>
            </Box>
            
            <Box sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              padding: 3, 
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography sx={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
                Powered by: Hedera Hashgraph & AI
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Spacer Section for proper scrolling */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ 
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.3)', 
            fontSize: '14px',
            textAlign: 'center'
          }}>
            About Hedera Trusty
          </Typography>
        </Box>
      </Box>
    </Container>
  );
} 