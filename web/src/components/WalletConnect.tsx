'use client'

import React, { useState } from 'react';
import { Button, Box, Typography, Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, ListItemIcon, Menu, MenuItem, Avatar, Divider, Snackbar } from '@mui/material';
import { AccountBalanceWallet, Logout, Download, Info, CheckCircle, ExpandMore, Person, Settings, AccountCircle, Error, Warning } from '@mui/icons-material';
import { useWallet } from '@/lib/walletContext';

export const WalletConnect: React.FC = () => {
  const { 
    isConnected, 
    accountId, 
    balance, 
    connect, 
    disconnect, 
    isLoading, 
    error,
    walletType,
    availableWallets,
    chainId,
    clearError
  } = useWallet();

  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const formatAccountId = (id: string) => {
    if (id.length > 12) {
      return `${id.slice(0, 6)}...${id.slice(-6)}`;
    }
    return id;
  };

  const formatBalance = (bal: string) => {
    const num = parseFloat(bal);
    return num.toFixed(4);
  };

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case 'metamask': return '#F6851B';
      case 'walletconnect': return '#3B99FC';
      case 'hashpack': return '#10A74A';
      case 'blade': return '#2F52D1';
      default: return '#666';
    }
  };

  const getWalletTypeLabel = (type: string) => {
    switch (type) {
      case 'metamask': return 'MetaMask';
      case 'walletconnect': return 'WalletConnect';
      case 'hashpack': return 'HashPack';
      case 'blade': return 'Blade';
      default: return 'Unknown';
    }
  };

  const getChainName = (chainId: string) => {
    switch (chainId) {
      case '0x1': return 'Ethereum Mainnet';
      case '0x3': return 'Ropsten Testnet';
      case '0x4': return 'Rinkeby Testnet';
      case '0x5': return 'Goerli Testnet';
      case '0x2a': return 'Kovan Testnet';
      case '0x89': return 'Polygon Mainnet';
      case '0x13881': return 'Mumbai Testnet';
      case '0xa': return 'Optimism';
      case '0xa4b1': return 'Arbitrum One';
      default: return `Chain ID: ${chainId}`;
    }
  };

  const handleConnectClick = (event: React.MouseEvent<HTMLElement>) => {
    if (availableWallets.length === 1) {
      // If only one wallet is available, connect directly
      connect(availableWallets[0]);
    } else {
      // Show wallet selection menu
      setAnchorEl(event.currentTarget);
    }
  };

  const handleWalletSelect = (walletName: string) => {
    setAnchorEl(null);
    connect(walletName);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleErrorClose = () => {
    clearError();
  };

  if (isLoading) {
    return (
      <Button
        variant="outlined"
        disabled
        startIcon={<CircularProgress size={16} />}
        sx={{
          color: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          padding: '8px 16px',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          }
        }}
      >
        Connecting...
      </Button>
    );
  }

  if (isConnected && accountId) {
    return (
      <>
        <Avatar
          onClick={handleProfileClick}
          sx={{
            width: 40,
            height: 40,
            cursor: 'pointer',
            backgroundColor: getWalletTypeColor(walletType || ''),
            border: '2px solid rgb(255, 255, 255)',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: getWalletTypeColor(walletType || ''),
              transform: 'scale(1.05)',
              boxShadow: `0 0 20px ${getWalletTypeColor(walletType || '')}40`
            }
          }}
        >
          <AccountCircle sx={{ fontSize: 24, color: '#fff' }} />
        </Avatar>

        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              mt: 1,
              minWidth: 280,
              borderRadius: '12px'
            }
          }}
        >
          {/* Profile Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: getWalletTypeColor(walletType || ''),
                }}
              >
                <AccountCircle sx={{ fontSize: 28, color: '#fff' }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600 }}>
                  {formatAccountId(accountId)}
                </Typography>
                <Chip
                  label={getWalletTypeLabel(walletType || '')}
                  size="small"
                  sx={{ 
                    backgroundColor: `rgba(${getWalletTypeColor(walletType || '').replace('#', '')}, 0.2)`,
                    color: getWalletTypeColor(walletType || ''),
                    border: `1px solid rgba(${getWalletTypeColor(walletType || '').replace('#', '')}, 0.3)`,
                    fontSize: '10px',
                    height: 20
                  }}
                />
              </Box>
            </Box>
            
            {balance && (
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                {formatBalance(balance)} {walletType === 'metamask' ? 'ETH' : 'ℏ'}
              </Typography>
            )}
            
            {chainId && walletType === 'metamask' && (
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {getChainName(chainId)}
              </Typography>
            )}
          </Box>

          {/* Menu Items */}
          <MenuItem 
            onClick={() => {
              // TODO: Implement change nickname functionality
              handleProfileClose();
            }}
            sx={{
              color: '#fff',
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemIcon>
              <Person sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Change Nickname"
              primaryTypographyProps={{ fontSize: '14px' }}
            />
          </MenuItem>

          <MenuItem 
            onClick={() => {
              // TODO: Implement wallet settings
              handleProfileClose();
            }}
            sx={{
              color: '#fff',
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemIcon>
              <Settings sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Wallet Settings"
              primaryTypographyProps={{ fontSize: '14px' }}
            />
          </MenuItem>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />

          <MenuItem 
            onClick={() => {
              disconnect();
              handleProfileClose();
            }}
            sx={{
              color: '#ff6b6b',
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 107, 0.1)'
              }
            }}
          >
            <ListItemIcon>
              <Logout sx={{ color: '#ff6b6b' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Disconnect Wallet"
              primaryTypographyProps={{ fontSize: '14px', color: '#ff6b6b' }}
            />
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleConnectClick}
        startIcon={<AccountBalanceWallet />}
        endIcon={availableWallets.length > 1 ? <ExpandMore /> : undefined}
        sx={{
          backgroundColor: 'rgba(50, 50, 50, 0.8)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '8px 16px',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(60, 60, 60, 0.9)',
            borderColor: 'rgba(255, 255, 255, 0.25)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        {availableWallets.length === 0 ? 'No Wallets' : 
         availableWallets.length === 1 ? 'Connect Wallet' : 'Connect Wallet'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            mt: 1
          }
        }}
      >
        {availableWallets.map((wallet, index) => (
          <MenuItem 
            key={index}
            onClick={() => handleWalletSelect(wallet)}
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: getWalletTypeColor(wallet.toLowerCase()),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AccountBalanceWallet sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {wallet}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>


      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleErrorClose} 
          severity="error" 
          sx={{ 
            width: '100%',
            backgroundColor: 'rgba(244, 67, 54, 0.9)',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}; 