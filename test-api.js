const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing /api/health...');
    const healthResult = await testEndpoint('/api/health');
    console.log('Status:', healthResult.status);
    console.log('Response:', healthResult.data);
    console.log('');

    // Test topic messages endpoint
    console.log('2. Testing /api/topic/messages...');
    const messagesResult = await testEndpoint('/api/topic/messages');
    console.log('Status:', messagesResult.status);
    if (messagesResult.data.messages) {
      console.log(`Found ${messagesResult.data.messages.length} messages`);
    }
    console.log('');

    // Test verified documents endpoint
    console.log('3. Testing /api/verified-documents...');
    const verifiedResult = await testEndpoint('/api/verified-documents');
    console.log('Status:', verifiedResult.status);
    if (verifiedResult.data.verifiedDocuments) {
      console.log(`Found ${verifiedResult.data.verifiedDocuments.length} verified documents`);
      if (verifiedResult.data.verifiedDocuments.length > 0) {
        const firstDoc = verifiedResult.data.verifiedDocuments[0];
        console.log('Sample document:');
        console.log('- Transaction ID:', firstDoc.transactionId);
        console.log('- Hash:', firstDoc.hash);
        console.log('- Status:', firstDoc.status);
        console.log('- Confidence:', firstDoc.aiVerification?.confidence);
      }
    }
    console.log('');

  } catch (error) {
    console.error('Error testing endpoints:', error.message);
  }
}

runTests(); 