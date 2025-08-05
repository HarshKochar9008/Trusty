import { Container, Card, CardContent, Typography, Box } from '@mui/material';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Container maxWidth="md" sx={{ 
        py: 8, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 'calc(100vh - 120px)'
      }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight={300} sx={{ color: '#fff', mb: 2 }}>
            About Hedera Trusty
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 400 }}>
            Next-generation health record verification platform powered by AI & blockchain
          </Typography>
        </Box>

        <Card sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '800px',
          mx: 'auto',
          flex: 1
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
      </Container>
      <Footer />
    </>
  );
} 