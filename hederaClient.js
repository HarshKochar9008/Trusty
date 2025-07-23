const { Client, AccountId, PrivateKey, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
require("dotenv").config();

function hederaClient() {
  const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
  const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
  let client;
  if (process.env.HEDERA_NETWORK === "mainnet") {
    client = Client.forMainnet();
  } else if (process.env.HEDERA_NETWORK === "testnet") {
    client = Client.forTestnet();
  } else {
    client = Client.forPreviewnet();
  }
  client.setOperator(operatorId, operatorKey);
  return client;
}

async function submitToHCS(client, topicId, message) {
  return await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(message)
    .execute(client);
}
module.exports = { hederaClient, submitToHCS }; 