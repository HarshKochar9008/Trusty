import { Container, Card, CardContent, Typography, Box } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export default function AboutPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Card sx={{ boxShadow: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LocalHospitalIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700} color="primary">
              About Trusty Health
            </Typography>
          </Box>
          <Typography color="text.primary" fontSize={20} mb={3}>
            Trusty Health is a next-generation platform for verifying and timestamping health records on the Hedera Hashgraph network. We combine AI-powered verification with the security and transparency of distributed ledger technology.
          </Typography>
          <Typography color="text.secondary" fontSize={18} mb={2}>
            <strong>Our Mission:</strong> Empower individuals and organizations to trust, share, and prove health data securely and efficiently, anywhere in the world.
          </Typography>
          <Typography color="primary" fontSize={18}>
            <strong>Powered by:</strong> Hedera Hashgraph & AI.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
} 