import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Health Record Verification",
  description: "Verify health records using AI and Hedera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppBar position="sticky" color="default" elevation={2} sx={{ mb: 4 }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <HealthAndSafetyIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h6" color="primary" fontWeight={700} component="a" href="/" sx={{ textDecoration: 'none' }}>
                  Trusty Health
                </Typography>
              </Box>
              <Box display="flex" gap={2}>
                <Button color="primary" href="/" sx={{ fontWeight: 500 }}>Home</Button>
                <Button color="primary" href="/verify" sx={{ fontWeight: 500 }}>Verify</Button>
                <Button color="primary" href="/transactions" sx={{ fontWeight: 500 }}>Transactions</Button>
                <Button color="primary" href="/topic" sx={{ fontWeight: 500 }}>Topic Info</Button>
                <Button color="primary" href="/about" sx={{ fontWeight: 500 }}>About</Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <div style={{ minHeight: "calc(100vh - 80px)", background: "#f4f6fb" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
