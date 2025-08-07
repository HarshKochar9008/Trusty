import { Client, AccountId, PrivateKey, TopicMessageSubmitTransaction } from "@hashgraph/sdk";

export function hederaClient() {
  // Check if environment variables are set
  if (!process.env.OPERATOR_ID || !process.env.OPERATOR_KEY) {
    throw new Error(
      'Hedera credentials not configured. Please set OPERATOR_ID and OPERATOR_KEY environment variables. ' +
      'For development, you can use testnet credentials from https://portal.hedera.com'
    );
  }

  try {
    const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
    let client: Client;
    
    if (process.env.HEDERA_NETWORK === "mainnet") {
      client = Client.forMainnet();
    } else if (process.env.HEDERA_NETWORK === "testnet") {
      client = Client.forTestnet();
    } else {
      client = Client.forPreviewnet();
    }
    
    client.setOperator(operatorId, operatorKey);
    return client;
  } catch (error) {
    throw new Error(
      `Failed to initialize Hedera client: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
      'Please check your OPERATOR_ID and OPERATOR_KEY values.'
    );
  }
}

export async function submitToHCS(client: Client, topicId: string, message: string) {
  return await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(message)
    .execute(client);
} 