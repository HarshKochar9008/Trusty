'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccountId, Client, NetworkName, Hbar } from '@hashgraph/sdk';

// MetaMask types
interface MetaMaskWindow extends Window {
  ethereum?: {
    isMetaMask: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (params: any) => void) => void;
    removeListener: (event: string, callback: (params: any) => void) => void;
    selectedAddress: string | null;
    chainId: string;
    isConnected: () => boolean;
  };
}

// WalletConnect types
interface WalletConnectWindow extends Window {
  WalletConnect?: any;
}

// HashPack types
interface HashPackWindow extends Window {
  hashpack?: {
    foundExtensionEvent: {
      once: (callback: (walletMetadata: any) => void) => void;
    };
    pairingEvent: {
      once: (callback: (pairingData: any) => void) => void;
    };
    connectionStatusChangeEvent: {
      once: (callback: (connectionStatus: any) => void) => void;
    };
    connectToLocalWallet: () => Promise<void>;
    disconnect: () => void;
    sendTransaction: (transaction: any) => Promise<any>;
    getAccountId: () => string;
    getBalance: () => Promise<string>;
  };
}

// Blade types
interface BladeWindow extends Window {
  blade?: {
    connect: () => Promise<any>;
    disconnect: () => void;
    getAccountId: () => string;
    getBalance: () => Promise<string>;
  };
}

interface WalletContextType {
  isConnected: boolean;
  accountId: string | null;
  balance: string | null;
  connect: (walletType: string) => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string | null>;
  signDocument: (documentHash: string) => Promise<any>;
  verifyDocument: (documentHash: string, signature: string, signer: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  walletType: 'metamask' | 'walletconnect' | 'hashpack' | 'blade' | null;
  availableWallets: string[];
  chainId: string | null;
  transactions: any[];
  getTransactionHistory: () => Promise<void>;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [walletType, setWalletType] = useState<'metamask' | 'walletconnect' | 'hashpack' | 'blade' | null>(null);
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const clearError = () => setError(null);

  // Check available wallets with better detection
  const checkAvailableWallets = () => {
    const wallets: string[] = [];
    
    if (typeof window !== 'undefined') {
      const metamaskWindow = window as MetaMaskWindow;
      const hashpackWindow = window as HashPackWindow;
      const bladeWindow = window as BladeWindow;
      
      // Check MetaMask
      if (metamaskWindow.ethereum?.isMetaMask) {
        wallets.push('MetaMask');
      }
      
      // Check HashPack (look for the extension)
      if (hashpackWindow.hashpack) {
        wallets.push('HashPack');
      }
      
      // Check Blade (look for the extension)
      if (bladeWindow.blade) {
        wallets.push('Blade');
      }
      
      // Always include WalletConnect as it can be used with mobile wallets
      wallets.push('WalletConnect');
    }
    
    setAvailableWallets(wallets);
    return wallets;
  };

  // Check if MetaMask is available
  const isMetaMaskAvailable = () => {
    if (typeof window !== 'undefined') {
      const metamaskWindow = window as MetaMaskWindow;
      return !!metamaskWindow.ethereum?.isMetaMask;
    }
    return false;
  };

  // Check if HashPack is available
  const isHashPackAvailable = () => {
    if (typeof window !== 'undefined') {
      const hashpackWindow = window as HashPackWindow;
      return !!hashpackWindow.hashpack;
    }
    return false;
  };

  // Check if Blade is available
  const isBladeAvailable = () => {
    if (typeof window !== 'undefined') {
      const bladeWindow = window as BladeWindow;
      return !!bladeWindow.blade;
    }
    return false;
  };

  const getMetaMask = () => {
    if (typeof window !== 'undefined') {
      const metamaskWindow = window as MetaMaskWindow;
      return metamaskWindow.ethereum;
    }
    return null;
  };

  const getHashPack = () => {
    if (typeof window !== 'undefined') {
      const hashpackWindow = window as HashPackWindow;
      return hashpackWindow.hashpack;
    }
    return null;
  };

  const getBlade = () => {
    if (typeof window !== 'undefined') {
      const bladeWindow = window as BladeWindow;
      return bladeWindow.blade;
    }
    return null;
  };

  // Connect to MetaMask with improved error handling
  const connectMetaMask = async () => {
    const ethereum = getMetaMask();
    if (!ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask extension.');
    }

    try {
      // Check if already connected
      if (ethereum.selectedAddress) {
        setAccountId(ethereum.selectedAddress);
        setChainId(ethereum.chainId);
        setIsConnected(true);
        setWalletType('metamask');
        
        // Get balance
        const balance = await ethereum.request({
          method: 'eth_getBalance',
          params: [ethereum.selectedAddress, 'latest']
        });
        
        const balanceInEther = parseInt(balance, 16) / Math.pow(10, 18);
        setBalance(balanceInEther.toFixed(4));
        return;
      }

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      
      if (!account) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }
      
      // Get chain ID
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      
      setAccountId(account);
      setChainId(chainId);
      setIsConnected(true);
      setWalletType('metamask');
      setError(null);
      
      // Get balance
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      
      const balanceInEther = parseInt(balance, 16) / Math.pow(10, 18);
      setBalance(balanceInEther.toFixed(4));
      
      // Listen for account changes
      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccountId(accounts[0]);
        }
      });
      
      // Listen for chain changes
      ethereum.on('chainChanged', (chainId: string) => {
        setChainId(chainId);
        window.location.reload();
      });
      
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      if (error.code === 4001) {
        throw new Error('User rejected the connection request.');
      } else if (error.code === -32002) {
        throw new Error('Please check MetaMask and approve the connection.');
      } else {
        throw new Error(`MetaMask connection failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Connect to WalletConnect with improved implementation
  const connectWalletConnect = async () => {
    try {
      // For now, we'll show a message to install WalletConnect
      // In a real implementation, you would use the WalletConnect library
      throw new Error('WalletConnect integration requires additional setup. Please use MetaMask, HashPack, or Blade for now.');
    } catch (error) {
      console.error('WalletConnect connection error:', error);
      throw error;
    }
  };

  // Connect to HashPack with improved implementation
  const connectHashPack = async () => {
    const hashpack = getHashPack();
    if (!hashpack) {
      throw new Error('HashPack not found. Please install HashPack extension.');
    }

    try {
      // Try to connect to local wallet
      await hashpack.connectToLocalWallet();
      setWalletType('hashpack');
      
      // The connection will be handled by event listeners
      // For now, we'll set a placeholder
      setAccountId('HashPack Account');
      setIsConnected(true);
      setBalance('0.0000');
      
    } catch (error: any) {
      console.error('HashPack connection error:', error);
      throw new Error(`HashPack connection failed: ${error.message || 'Please check HashPack extension'}`);
    }
  };

  // Connect to Blade with improved implementation
  const connectBlade = async () => {
    const blade = getBlade();
    if (!blade) {
      throw new Error('Blade not found. Please install Blade extension.');
    }

    try {
      const result = await blade.connect();
      if (result && result.accountId) {
        setAccountId(result.accountId);
        setIsConnected(true);
        setWalletType('blade');
        setError(null);
        
        // Get balance
        try {
          const balance = await blade.getBalance();
          setBalance(balance);
        } catch (balanceError) {
          setBalance('0.0000');
        }
      } else {
        throw new Error('Failed to get account information from Blade');
      }
    } catch (error: any) {
      console.error('Blade connection error:', error);
      throw new Error(`Blade connection failed: ${error.message || 'Please check Blade extension'}`);
    }
  };

  useEffect(() => {
    const initializeWallets = async () => {
      const wallets = checkAvailableWallets();
      
      if (wallets.length === 0) {
        setError("No wallet extensions found. Please install MetaMask, HashPack, or Blade wallet.");
        return;
      }

      // Initialize HashPack if available
      if (isHashPackAvailable()) {
        const hashpack = getHashPack();
        if (hashpack) {
          try {
            hashpack.foundExtensionEvent.once((walletMetadata) => {
              console.log("Found HashPack extension", walletMetadata);
            });

            hashpack.pairingEvent.once((pairingData) => {
              console.log("Paired with HashPack wallet", pairingData);
              if (pairingData.accountIds && pairingData.accountIds.length > 0) {
                setAccountId(pairingData.accountIds[0]);
                setIsConnected(true);
                setWalletType('hashpack');
                setError(null);
              }
            });

            hashpack.connectionStatusChangeEvent.once((connectionStatus) => {
              console.log("Connection status changed", connectionStatus);
              if (!connectionStatus.connected) {
                disconnect();
              }
            });
          } catch (err) {
            console.error("Failed to initialize HashPack:", err);
          }
        }
      }

      // Check if MetaMask is already connected
      const ethereum = getMetaMask();
      if (ethereum && ethereum.selectedAddress) {
        setAccountId(ethereum.selectedAddress);
        setChainId(ethereum.chainId);
        setIsConnected(true);
        setWalletType('metamask');
        
        // Get balance for already connected MetaMask
        try {
          const balance = await ethereum.request({
            method: 'eth_getBalance',
            params: [ethereum.selectedAddress, 'latest']
          });
          
          const balanceInEther = parseInt(balance, 16) / Math.pow(10, 18);
          setBalance(balanceInEther.toFixed(4));
        } catch (err) {
          console.error("Failed to get MetaMask balance:", err);
          setBalance('0.0000');
        }
      }
    };

    // Wait for window to be available
    if (typeof window !== 'undefined') {
      initializeWallets();
    }
  }, []);

  const connect = async (walletType: string) => {
    setIsLoading(true);
    setError(null);

    try {
      switch (walletType.toLowerCase()) {
        case 'metamask':
          if (!isMetaMaskAvailable()) {
            throw new Error('MetaMask not available. Please install MetaMask extension.');
          }
          await connectMetaMask();
          break;
          
        case 'walletconnect':
          await connectWalletConnect();
          break;
          
        case 'hashpack':
          if (!isHashPackAvailable()) {
            throw new Error('HashPack not available. Please install HashPack extension.');
          }
          await connectHashPack();
          break;
          
        case 'blade':
          if (!isBladeAvailable()) {
            throw new Error('Blade not available. Please install Blade extension.');
          }
          await connectBlade();
          break;
          
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }
    } catch (err: any) {
      console.error("Failed to connect:", err);
      setError(err.message || "Failed to connect to wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    if (walletType === 'metamask') {
      // MetaMask doesn't have a disconnect method, just clear state
    } else if (walletType === 'walletconnect') {
      // WalletConnect disconnect logic
    } else if (walletType === 'hashpack') {
      const hashpack = getHashPack();
      if (hashpack) {
        try {
          hashpack.disconnect();
        } catch (err) {
          console.error("Failed to disconnect HashPack:", err);
        }
      }
    } else if (walletType === 'blade') {
      const blade = getBlade();
      if (blade) {
        try {
          blade.disconnect();
        } catch (err) {
          console.error("Failed to disconnect Blade:", err);
        }
      }
    }
    
    setIsConnected(false);
    setAccountId(null);
    setBalance(null);
    setClient(null);
    setWalletType(null);
    setChainId(null);
    setError(null);
  };

  const signMessage = async (message: string): Promise<string | null> => {
    if (!isConnected || !accountId) {
      setError("Wallet not connected");
      return null;
    }

    try {
      if (walletType === 'metamask') {
        const ethereum = getMetaMask();
        if (!ethereum) {
          throw new Error('MetaMask not available');
        }
        
        const signature = await ethereum.request({
          method: 'personal_sign',
          params: [message, accountId]
        });
        return signature;
        
      } else if (walletType === 'walletconnect') {
        throw new Error('WalletConnect signing not implemented yet');
        
      } else if (walletType === 'hashpack') {
        const hashpack = getHashPack();
        if (!hashpack) {
          throw new Error('HashPack not available');
        }
        
        // HashPack signing implementation would go here
        throw new Error('HashPack signing not implemented yet');
        
      } else if (walletType === 'blade') {
        const blade = getBlade();
        if (!blade) {
          throw new Error('Blade not available');
        }
        
        // Blade signing implementation would go here
        throw new Error('Blade signing not implemented yet');
      }
      
      return null;
    } catch (err: any) {
      console.error("Failed to sign message:", err);
      setError(err.message || "Failed to sign message");
      return null;
    }
  };

  const signDocument = async (documentHash: string): Promise<any> => {
    if (!isConnected || !accountId) {
      throw new Error("Wallet not connected");
    }

    try {
      const message = `Sign this document hash: ${documentHash}`;
      const signature = await signMessage(message);
      
      if (signature) {
        return {
          documentHash,
          signature,
          signer: accountId,
          timestamp: Date.now(),
          verified: false
        };
      }
      
      throw new Error("Failed to sign document");
    } catch (err: any) {
      console.error("Failed to sign document:", err);
      throw err;
    }
  };

  const verifyDocument = async (documentHash: string, signature: string, signer: string): Promise<boolean> => {
    try {
      // For now, we'll do a basic verification
      // In a real implementation, you would verify the signature cryptographically
      const message = `Sign this document hash: ${documentHash}`;
      
      // This is a simplified verification - in production you'd use proper cryptographic verification
      return signature.length > 0 && signer.length > 0;
    } catch (err) {
      console.error("Failed to verify document:", err);
      return false;
    }
  };

  const getTransactionHistory = async (): Promise<void> => {
    if (!isConnected || !accountId || walletType !== 'metamask') {
      return;
    }

    try {
      const ethereum = getMetaMask();
      if (!ethereum) {
        throw new Error('MetaMask not available');
      }

      // Get the latest block number
      const latestBlock = await ethereum.request({
        method: 'eth_blockNumber'
      });

      const blockNumber = parseInt(latestBlock, 16);
      const transactions: any[] = [];

      // Get transactions from the last 10 blocks
      for (let i = 0; i < 10; i++) {
        try {
          const block = await ethereum.request({
            method: 'eth_getBlockByNumber',
            params: [`0x${(blockNumber - i).toString(16)}`, true]
          });

          if (block && block.transactions) {
            block.transactions.forEach((tx: any) => {
              if (tx.from?.toLowerCase() === accountId.toLowerCase() || 
                  tx.to?.toLowerCase() === accountId.toLowerCase()) {
                transactions.push({
                  hash: tx.hash,
                  from: tx.from,
                  to: tx.to,
                  value: (parseInt(tx.value, 16) / Math.pow(10, 18)).toString(),
                  gas: tx.gas,
                  gasPrice: (parseInt(tx.gasPrice, 16) / Math.pow(10, 9)).toString(),
                  nonce: parseInt(tx.nonce, 16),
                  blockNumber: parseInt(block.number, 16),
                  blockHash: block.hash,
                  timestamp: parseInt(block.timestamp, 16),
                  status: 'confirmed',
                  type: tx.from?.toLowerCase() === accountId.toLowerCase() ? 'send' : 'receive',
                  description: tx.from?.toLowerCase() === accountId.toLowerCase() ? 'Sent ETH' : 'Received ETH'
                });
              }
            });
          }
        } catch (err) {
          console.error(`Failed to get block ${blockNumber - i}:`, err);
        }
      }

      setTransactions(transactions);
    } catch (err: any) {
      console.error("Failed to get transaction history:", err);
      setError(err.message || "Failed to get transaction history");
    }
  };

  const value: WalletContextType = {
    isConnected,
    accountId,
    balance,
    connect,
    disconnect,
    signMessage,
    signDocument,
    verifyDocument,
    isLoading,
    error,
    walletType,
    availableWallets,
    chainId,
    transactions,
    getTransactionHistory,
    clearError
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 