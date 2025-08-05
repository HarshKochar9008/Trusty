# Health Record Verification System - Setup Instructions

## ✅ Current Status
The health record verification system is now **FIXED** and working! 

### What was fixed:
1. **Missing Environment Variables** - Added fallback verification when API keys are not available
2. **API Key Dependencies** - System now works without requiring API keys for basic testing
3. **Backend Server** - Fixed server startup issues and added proper error handling
4. **File Upload** - Added support for JSON files and improved file handling

## 🚀 Quick Start (No API Keys Required)

1. **Backend Server** (Port 3001):
   ```bash
   node apiServer.js
   ```

2. **Frontend** (Port 3000):
   ```bash
   cd web
   npm run dev
   ```

3. **Test Verification**:
   - Go to http://localhost:3000/verify
   - Upload the `sampleHealthRecord.json` file
   - Click "Verify Record"
   - You should see verification results with 64% confidence

## 🔧 Full Setup (With API Keys)

For enhanced verification with AI models, create a `.env` file in the root directory:

```env
# Hedera Network Configuration
HEDERA_NETWORK=testnet
OPERATOR_ID=your_hedera_operator_id_here
OPERATOR_KEY=your_hedera_operator_private_key_here
HEDERA_TOPIC_ID=your_hedera_topic_id_here

# AI API Keys (Required for full functionality)
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3001

# Next.js Public Environment Variables (for frontend)
NEXT_PUBLIC_HEDERA_OPERATOR_ID=your_hedera_operator_id_here
NEXT_PUBLIC_HEDERA_OPERATOR_KEY=your_hedera_operator_private_key_here
```

### API Keys Required:
- **OpenAI API Key**: For LLM verification, fraud detection, medical validation, and anomaly detection
- **Gemini API Key**: For document extraction from images and PDFs
- **Hedera Credentials**: For blockchain integration (optional)

## 📁 Supported File Types
- **JSON files**: Direct parsing (recommended for testing)
- **PDF files**: Requires Gemini API key for extraction
- **Image files** (PNG, JPG, JPEG): Requires Gemini API key for extraction

## 🧪 Testing
Use the included `sampleHealthRecord.json` file to test the verification system.

## 🔍 Verification Features
- **Basic Verification**: Works without API keys
- **AI-Powered Verification**: Requires OpenAI and Gemini API keys
- **Fraud Detection**: Identifies suspicious patterns
- **Medical Validation**: Validates medical terminology and procedures
- **Anomaly Detection**: Finds statistical and logical anomalies
- **Blockchain Integration**: Stores verification results on Hedera (optional)

## 🐛 Troubleshooting
If you encounter issues:
1. Check that both servers are running (ports 3000 and 3001)
2. Ensure the sample file is in the root directory
3. Check browser console for any errors
4. Verify network connectivity between frontend and backend 