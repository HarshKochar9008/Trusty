const axios = require('axios');

async function testVerifiedDocumentsEndpoint() {
  try {
    console.log('Testing verified documents endpoint...');
    
    const response = await axios.get('http://localhost:3001/api/verified-documents');
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.verifiedDocuments) {
      console.log(`Found ${response.data.verifiedDocuments.length} verified documents`);
      
      if (response.data.verifiedDocuments.length > 0) {
        const firstDoc = response.data.verifiedDocuments[0];
        console.log('Sample document structure:');
        console.log('- Transaction ID:', firstDoc.transactionId);
        console.log('- Hash:', firstDoc.hash);
        console.log('- Status:', firstDoc.status);
        console.log('- Confidence:', firstDoc.aiVerification.confidence);
        console.log('- Risk Level:', firstDoc.aiVerification.riskLevel);
      }
    }
    
  } catch (error) {
    console.error('Error testing endpoint:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Also test the regular topic messages endpoint
async function testTopicMessagesEndpoint() {
  try {
    console.log('\nTesting topic messages endpoint...');
    
    const response = await axios.get('http://localhost:3001/api/topic/messages');
    
    console.log('Response status:', response.status);
    console.log(`Found ${response.data.messages ? response.data.messages.length : 0} messages`);
    
  } catch (error) {
    console.error('Error testing topic messages endpoint:', error.message);
  }
}

// Run tests
async function runTests() {
  await testTopicMessagesEndpoint();
  await testVerifiedDocumentsEndpoint();
}

runTests(); 