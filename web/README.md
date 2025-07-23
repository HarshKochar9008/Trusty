# Trusty Health Record Verifier

## Overview
Trusty is a platform for verifying, timestamping, and managing health records using AI and Hedera Hashgraph. It allows users to upload health records (JSON, PDF, or image), verifies them using AI, and stores verification metadata on the Hedera network for transparency and security.

## Features
- Upload and verify health records (JSON, PDF, PNG, JPG, JPEG)
- AI-powered verification for authenticity and completeness
- Stores verification metadata on Hedera Hashgraph
- View transaction history and topic information
- Simple, modern web interface

## How It Works
1. **Upload Record:** Users upload a health record file.
2. **AI Verification:** The system uses AI to check the record for required fields and authenticity.
3. **Metadata Generation:** Metadata about the verification is created and hashed for privacy.
4. **Hedera Submission:** The metadata is submitted to the Hedera Hashgraph network.
5. **Transparency:** Users can view transaction details on HashScan.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   node apiServer.js
   ```
3. Start the frontend:
   ```bash
   cd web
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License
MIT License © 2025 Harshk
