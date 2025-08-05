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

  // Check available wallets
  const checkAvailableWallets = () => {
    const wallets: string[] = [];
    
    if (typeof window !== 'undefined') {
      const metamaskWindow = window as MetaMaskWindow;
      const walletConnectWindow = window as WalletConnectWindow;
      const hashpackWindow = window as HashPackWindow;
      const bladeWindow = window as BladeWindow;
      
      if (metamaskWindow.ethereum?.isMetaMask) {
        wallets.push('MetaMask');
      }
      
      if (walletConnectWindow.WalletConnect) {
        wallets.push('WalletConnect');
      }
      
      if (hashpackWindow.hashpack) {
        wallets.push('HashPack');
      }
      
      if (bladeWindow.blade) {
        wallets.push('Blade');
      }
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

  // Check if WalletConnect is available
  const isWalletConnectAvailable = () => {
    if (typeof window !== 'undefined') {
      const walletConnectWindow = window as WalletConnectWindow;
      return !!walletConnectWindow.WalletConnect;
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

  const getWalletConnect = () => {
    if (typeof window !== 'undefined') {
      const walletConnectWindow = window as WalletConnectWindow;
      return walletConnectWindow.WalletConnect;
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

  // Connect to MetaMask
  const connectMetaMask = async () => {
    const ethereum = getMetaMask();
    if (!ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      
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
      
      // Convert from wei to ether
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
      
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw new Error('Failed to connect to MetaMask');
    }
  };

  // Connect to WalletConnect
  const connectWalletConnect = async () => {
    const WalletConnect = getWalletConnect();
    if (!WalletConnect) {
      throw new Error('WalletConnect not found');
    }

    try {
      // Initialize WalletConnect
      const connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        clientMeta: {
          name: 'Hedera Trusty',
          description: 'Health Record Verification Platform',
          url: window.location.origin,
          icons: ['https://your-app-icon.png']
        }
      });

      if (!connector.connected) {
        await connector.createSession();
      }

      const { accounts } = connector;
      if (accounts && accounts.length > 0) {
        setAccountId(accounts[0]);
        setIsConnected(true);
        setWalletType('walletconnect');
        setError(null);
        
        // Get balance (you might need to implement this based on the chain)
        setBalance('0.0000'); // Placeholder
      }
      
    } catch (error) {
      console.error('WalletConnect connection error:', error);
      throw new Error('Failed to connect to WalletConnect');
    }
  };

  // Connect to HashPack
  const connectHashPack = async () => {
    const hashpack = getHashPack();
    if (!hashpack) {
      throw new Error('HashPack not found');
    }

    try {
      await hashpack.connectToLocalWallet();
      setWalletType('hashpack');
      // HashPack connection will be handled by the event listeners
    } catch (error) {
      console.error('HashPack connection error:', error);
      throw new Error('Failed to connect to HashPack');
    }
  };

  // Connect to Blade
  const connectBlade = async () => {
    const blade = getBlade();
    if (!blade) {
      throw new Error('Blade not found');
    }

    try {
      const result = await blade.connect();
      if (result.accountId) {
        setAccountId(result.accountId);
        setIsConnected(true);
        setWalletType('blade');
        setError(null);
        
        // Get balance
        const balance = await blade.getBalance();
        setBalance(balance);
      }
    } catch (error) {
      console.error('Blade connection error:', error);
      throw new Error('Failed to connect to Blade');
    }
  };

  useEffect(() => {
    const initializeWallets = async () => {
      const wallets = checkAvailableWallets();
      
      if (wallets.length === 0) {
        setError("No wallet extensions found. Please install MetaMask, WalletConnect, HashPack, or Blade wallet.");
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
          if (!isWalletConnectAvailable()) {
            throw new Error('WalletConnect not available.');
          }
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
    } catch (err) {
      console.error("Failed to connect:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    if (walletType === 'metamask') {
      // MetaMask doesn't have a disconnect method, just clear state
    } else if (walletType === 'walletconnect') {
      const WalletConnect = getWalletConnect();
      if (WalletConnect) {
        // Disconnect WalletConnect session
      }
    } else if (walletType === 'hashpack') {
      const hashpack = getHashPack();
      if (hashpack) {
        hashpack.disconnect();
      }
    } else if (walletType === 'blade') {
      const blade = getBlade();
      if (blade) {
        blade.disconnect();
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
        // Implement WalletConnect signing
        throw new Error('WalletConnect signing not implemented yet');
        
      } else if (walletType === 'hashpack') {
        // Implement HashPack signing
        throw new Error('HashPack signing not implemented yet');
        
      } else if (walletType === 'blade') {
        // Implement Blade signing
        throw new Error('Blade signing not implemented yet');
      }
      
      return null;
    } catch (err) {
      console.error("Failed to sign message:", err);
      setError("Failed to sign message");
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
    } catch (err) {
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
    } catch (err) {
      console.error("Failed to get transaction history:", err);
      setError("Failed to get transaction history");
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
    getTransactionHistory
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 