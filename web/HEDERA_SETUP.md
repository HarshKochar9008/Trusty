# Hedera Wallet Integration Setup Guide

This guide will help you set up Hedera wallet connectivity using HashPack in your Trusty Health application.

## Prerequisites

1. **HashPack Wallet Extension**: Install the HashPack wallet extension from [hashpack.app](https://hashpack.app)
2. **Hedera Testnet Account**: Create a testnet account for development
3. **Node.js and npm**: Ensure you have the latest versions installed

## Installation

1. Install the required dependencies:
```bash
npm install @hashgraph/sdk
```

2. The dependencies have already been added to your `package.json` file.

## Configuration

### 1. Environment Variables

Create a `.env.local` file in your `web` directory with the following variables:

```env
# Hedera Network Configuration
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_HEDERA_OPERATOR_ID=your_operator_account_id
NEXT_PUBLIC_HEDERA_OPERATOR_KEY=your_operator_private_key
```

### 2. Get Hedera Testnet Credentials

1. Visit [portal.hedera.com](https://portal.hedera.com)
2. Create a new account on the testnet
3. Copy your Account ID and Private Key
4. Add them to your `.env.local` file

### 3. HashPack Extension Setup

1. Install the HashPack browser extension from [hashpack.app](https://hashpack.app)
2. Create a new wallet or import an existing one
3. Switch to testnet for development
4. Ensure the extension is unlocked and ready to connect

## Features Implemented

### 1. Wallet Connection
- Connect to HashPack wallet through browser extension
- Display account ID and balance
- Disconnect functionality
- Connection status management

### 2. Message Signing
- Sign messages with the connected wallet
- Verify signatures
- Display signed messages

### 3. Hedera Network Operations
- Create topics for health record verification
- Submit messages to topics
- Create files on the Hedera network
- Transfer HBAR between accounts
- Query account balances

### 4. Smart Contract Support
- Deploy smart contracts
- Execute contract functions
- Query contract state

## Usage

### 1. Connect Wallet
1. Ensure HashPack extension is installed and unlocked
2. Click the "Connect Wallet" button in the navigation
3. Approve the connection in your HashPack wallet
4. Your account ID and balance will be displayed

### 2. Demo Features
Visit `/wallet-demo` to test:
- Message signing
- Topic creation and messaging
- File operations
- Transaction history

### 3. Integration with Health Records
The wallet can be used to:
- Sign health record verification requests
- Store verification results on Hedera
- Create immutable audit trails
- Enable decentralized identity verification

## Network Configuration

### Testnet (Development)
```typescript
import { NetworkName } from '@hashgraph/sdk';
const network = NetworkName.Testnet;
```

### Mainnet (Production)
```typescript
import { NetworkName } from '@hashgraph/sdk';
const network = NetworkName.Mainnet;
```

## Security Considerations

1. **Private Keys**: Never expose private keys in client-side code
2. **Environment Variables**: Use environment variables for sensitive data
3. **Network Selection**: Use testnet for development, mainnet for production
4. **Transaction Fees**: Monitor and set appropriate transaction fees
5. **Error Handling**: Implement proper error handling for wallet operations

## Troubleshooting

### Common Issues

1. **Wallet Not Connecting**
   - Ensure HashPack extension is installed and unlocked
   - Check if the extension is on the correct network (testnet/mainnet)
   - Verify the extension is not blocked by browser security

2. **Transaction Failures**
   - Check account balance
   - Verify transaction fees
   - Ensure proper network selection

3. **Environment Variables**
   - Restart the development server after adding environment variables
   - Verify variable names and values

### Debug Mode

Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('hashpack-debug', 'true');
```

## API Reference

### Wallet Context Hook
```typescript
const { 
  isConnected, 
  accountId, 
  balance, 
  connect, 
  disconnect, 
  signMessage,
  isLoading,
  error 
} = useWallet();
```

### Hedera Utils
```typescript
import { createHederaUtils } from '@/lib/hederaUtils';

const hederaUtils = createHederaUtils(NetworkName.Testnet);

// Create a topic
const topicId = await hederaUtils.createTopic('My Topic');

// Submit a message
const txId = await hederaUtils.submitTopicMessage(topicId, 'Hello Hedera!');

// Create a file
const fileId = await hederaUtils.createFile('File content', 'My File');
```

## HashPack Integration Details

The implementation uses HashPack's browser extension injection pattern:

```typescript
// Check if HashPack is available
const isHashPackAvailable = () => {
  if (typeof window !== 'undefined') {
    return !!(window as any).hashpack;
  }
  return false;
};

// Get HashPack instance
const getHashPack = () => {
  if (typeof window !== 'undefined') {
    return (window as any).hashpack;
  }
  return null;
};
```

## Next Steps

1. **Customize the UI**: Modify the wallet connection component styling
2. **Add More Operations**: Implement additional Hedera operations
3. **Smart Contracts**: Deploy and interact with health record smart contracts
4. **Production Deployment**: Configure for mainnet deployment
5. **Security Audit**: Review and enhance security measures

## Support

For issues related to:
- **HashPack**: Visit [hashpack.app](https://hashpack.app)
- **Hedera**: Visit [hedera.com](https://hedera.com)
- **This Implementation**: Check the code comments and documentation

## License

This implementation is part of the Trusty Health project and follows the same license terms. 