// Environment Configuration for Health Record Verification System
// Copy this to a .env file in the root directory

module.exports = {
  // Required Environment Variables:
  
  // Hedera Network Configuration
  HEDERA_NETWORK: 'testnet', // or 'mainnet'
  OPERATOR_ID: 'your_hedera_operator_id_here',
  OPERATOR_KEY: 'your_hedera_operator_private_key_here', 
  HEDERA_TOPIC_ID: 'your_hedera_topic_id_here',
  
  // AI API Keys (Required for verification)
  OPENAI_API_KEY: 'your_openai_api_key_here',
  GEMINI_API_KEY: 'your_gemini_api_key_here',
  
  // Server Configuration
  PORT: 3001,
  
  // Next.js Public Environment Variables (for frontend)
  NEXT_PUBLIC_HEDERA_OPERATOR_ID: 'your_hedera_operator_id_here',
  NEXT_PUBLIC_HEDERA_OPERATOR_KEY: 'your_hedera_operator_private_key_here'
};

// Instructions:
// 1. Create a .env file in the root directory
// 2. Add the above variables with your actual values
// 3. For testing, you can use the sample health record without API keys
// 4. For full functionality, you need OpenAI and Gemini API keys 