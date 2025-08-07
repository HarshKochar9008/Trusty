# Environment Setup Guide

To fix the "issue record on blockchain" error, you need to configure Hedera credentials.

## Quick Setup

1. **Create a `.env.local` file** in the `web` directory with the following content:

```env
# Hedera Network Configuration
HEDERA_NETWORK=testnet
OPERATOR_ID=0.0.123456
OPERATOR_KEY=302e020100300506032b6570042204201234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
HEDERA_TOPIC_ID=0.0.123456

# Next.js Public Environment Variables (for frontend)
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_HEDERA_OPERATOR_ID=0.0.123456
NEXT_PUBLIC_HEDERA_OPERATOR_KEY=302e020100300506032b6570042204201234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

## Get Real Testnet Credentials

1. Visit [portal.hedera.com](https://portal.hedera.com)
2. Create a new testnet account
3. Copy your Account ID and Private Key
4. Replace the placeholder values in `.env.local`

## Create a Topic

You also need a Hedera Topic ID. You can:

1. **Use the existing topic** from the root directory's `hederaClient.js`
2. **Create a new topic** using the Hedera portal
3. **Use the demo topic** from the setup instructions

## Restart the Development Server

After setting up the environment variables:

```bash
npm run dev
```

## Alternative: Use Demo Mode

If you want to test without real credentials, you can modify the API to return a mock response for development. 