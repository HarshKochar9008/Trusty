const express = require("express");
const hederaClient = require("./hederaClient");
const { TopicCreateTransaction, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
const { verifyHealthRecord, verifyHealthRecordLLM } = require('./aiVerifier');
require("dotenv").config();
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const sampleRecord = {
  patientName: "Riya Sharma",
  dob: "1995-06-25",
  diagnosis: "Hypertension",
  issuedBy: "Apollo Hospitals",
  dateIssued: "2025-07-10"
};

function generateMetadata(verification, originalRecord) {
  const metadata = {
    ...originalRecord,
    verified: verification.verified,
    confidence: verification.confidence,
    timestamp: new Date().toISOString()
  };
  return metadata;
}

async function submitToHCS(client, topicId, message) {
  const topicTx = await new TopicCreateTransaction().execute(client);
  const topicIdFromTx = (await topicTx.getReceipt(client)).topicId;

  const msgTx = await new TopicMessageSubmitTransaction()
    .setTopicId(topicIdFromTx)
    .setMessage(message)
    .execute(client);

  return msgTx;
}

async function main() {
    const inputFile = process.argv[2];
    const useLLM = process.argv.includes('--llm');
    if (!inputFile) {
        console.error('Usage: node index.js <healthRecord.json> [--llm]');
        process.exit(1);
    }
    const recordPath = path.resolve(inputFile);
    if (!fs.existsSync(recordPath)) {
        console.error('File not found:', recordPath);
        process.exit(1);
    }
    const record = JSON.parse(fs.readFileSync(recordPath, 'utf-8'));
    let verification;
    if (useLLM) {
        console.log('Using LLM-based verification...');
        verification = await verifyHealthRecordLLM(record);
    } else {
        console.log('Using rule-based verification...');
        verification = verifyHealthRecord(record);
    }
    if (!verification.isValid) {
        console.error('Health record verification failed.', verification.missingFields ? ('Missing fields: ' + verification.missingFields) : '', verification.suspiciousFields ? ('Suspicious fields: ' + verification.suspiciousFields) : '', verification.error ? ('Error: ' + verification.error) : '');
        process.exit(1);
    }
    const metadata = generateMetadata(verification.metadata || record, record);
    const client = hederaClient();
    const topicId = process.env.HEDERA_TOPIC_ID;
    if (!topicId) {
        console.error('HEDERA_TOPIC_ID not set in .env');
        process.exit(1);
    }
    try {
        const txResponse = await submitToHCS(client, topicId, JSON.stringify(metadata));
        const receipt = await txResponse.getReceipt(client);
        console.log('Metadata submitted to Hedera HCS.');
        console.log('Transaction ID:', txResponse.transactionId.toString());
        console.log('View on HashScan:', `https://hashscan.io/testnet/transaction/${txResponse.transactionId.toString()}`);
    } catch (err) {
        console.error('Failed to submit to Hedera HCS:', err);
        process.exit(1);
    }
}

main();

app.get("/", (req, res) => {
  res.send("Smart Health Record Verifier API running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
