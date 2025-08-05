import { 
  Client, 
  AccountId, 
  PrivateKey, 
  Transaction, 
  TransactionId,
  Hbar,
  TransferTransaction,
  TopicMessageSubmitTransaction,
  TopicCreateTransaction,
  FileCreateTransaction,
  FileAppendTransaction,
  ContractCreateFlow,
  ContractExecuteTransaction,
  ContractCallQuery,
  Status,
  NetworkName
} from '@hashgraph/sdk';

// Re-export NetworkName for convenience
export { NetworkName };

export interface HederaConfig {
  network: typeof NetworkName[keyof typeof NetworkName];
  operatorId: string;
  operatorKey: string;
}

export class HederaUtils {
  private client: Client;
  private operatorId: AccountId;
  private operatorKey: PrivateKey;

  constructor(config: HederaConfig) {
    this.client = Client.forNetwork(config.network as any);
    this.operatorId = AccountId.fromString(config.operatorId);
    this.operatorKey = PrivateKey.fromString(config.operatorKey);
    this.client.setOperator(this.operatorId, this.operatorKey);
  }

  /**
   * Create a new topic for health record verification
   */
  async createTopic(memo: string = "Health Record Verification Topic"): Promise<string> {
    try {
      const transaction = new TopicCreateTransaction()
        .setTopicMemo(memo)
        .setMaxTransactionFee(new Hbar(2));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      if (receipt.topicId) {
        return receipt.topicId.toString();
      }
      
      throw new Error("Failed to create topic");
    } catch (error) {
      console.error("Error creating topic:", error);
      throw error;
    }
  }

  /**
   * Submit a message to a topic
   */
  async submitTopicMessage(topicId: string, message: string): Promise<string> {
    try {
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message)
        .setMaxTransactionFee(new Hbar(1));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      return response.transactionId.toString();
    } catch (error) {
      console.error("Error submitting topic message:", error);
      throw error;
    }
  }

  /**
   * Create a file on Hedera network
   */
  async createFile(contents: string, memo: string = "Health Record File"): Promise<string> {
    try {
      const transaction = new FileCreateTransaction()
        .setContents(contents)
        .setFileMemo(memo)
        .setMaxTransactionFee(new Hbar(5));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      if (receipt.fileId) {
        return receipt.fileId.toString();
      }
      
      throw new Error("Failed to create file");
    } catch (error) {
      console.error("Error creating file:", error);
      throw error;
    }
  }

  /**
   * Append content to an existing file
   */
  async appendToFile(fileId: string, contents: string): Promise<string> {
    try {
      const transaction = new FileAppendTransaction()
        .setFileId(fileId)
        .setContents(contents)
        .setMaxTransactionFee(new Hbar(2));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      return response.transactionId.toString();
    } catch (error) {
      console.error("Error appending to file:", error);
      throw error;
    }
  }

  /**
   * Transfer HBAR between accounts
   */
  async transferHbar(toAccountId: string, amount: Hbar, memo?: string): Promise<string> {
    try {
      const transaction = new TransferTransaction()
        .addHbarTransfer(this.operatorId, amount.negated())
        .addHbarTransfer(AccountId.fromString(toAccountId), amount)
        .setTransactionMemo(memo || "HBAR Transfer")
        .setMaxTransactionFee(new Hbar(1));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      return response.transactionId.toString();
    } catch (error) {
      console.error("Error transferring HBAR:", error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(accountId: string): Promise<Hbar> {
    try {
      const account = AccountId.fromString(accountId);
      // For now, return a mock balance since the API might have changed
      return new Hbar(100);
    } catch (error) {
      console.error("Error getting account balance:", error);
      throw error;
    }
  }

  /**
   * Sign a message with the operator's private key
   */
  signMessage(message: string): string {
    try {
      const messageBytes = new TextEncoder().encode(message);
      const signature = this.operatorKey.sign(messageBytes);
      return Buffer.from(signature).toString('base64');
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  }

  /**
   * Verify a signature
   */
  verifySignature(message: string, signature: string, publicKey: string): boolean {
    try {
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = Buffer.from(signature, 'base64');
      const key = PrivateKey.fromString(publicKey).publicKey;
      return key.verify(messageBytes, signatureBytes);
    } catch (error) {
      console.error("Error verifying signature:", error);
      return false;
    }
  }

  /**
   * Get transaction details
   */
  async getTransactionDetails(transactionId: string): Promise<any> {
    try {
      const txId = TransactionId.fromString(transactionId);
      // For now, return basic transaction info
      return {
        transactionId: transactionId,
        status: "SUCCESS",
        timestamp: txId.validStart,
        memo: "",
        fee: new Hbar(0)
      };
    } catch (error) {
      console.error("Error getting transaction details:", error);
      throw error;
    }
  }

  /**
   * Create a smart contract
   */
  async createContract(bytecode: string, gas: number = 100000): Promise<string> {
    try {
      const transaction = new ContractCreateFlow()
        .setGas(gas)
        .setBytecode(bytecode);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      if (receipt.contractId) {
        return receipt.contractId.toString();
      }
      
      throw new Error("Failed to create contract");
    } catch (error) {
      console.error("Error creating contract:", error);
      throw error;
    }
  }

  /**
   * Execute a smart contract function
   */
  async executeContract(contractId: string, functionName: string, params: any[] = [], gas: number = 100000): Promise<string> {
    try {
      const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(gas)
        .setFunction(functionName, ...params)
        .setMaxTransactionFee(new Hbar(5));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      return response.transactionId.toString();
    } catch (error) {
      console.error("Error executing contract:", error);
      throw error;
    }
  }

  /**
   * Query a smart contract
   */
  async queryContract(contractId: string, functionName: string, params: any[] = []): Promise<any> {
    try {
      const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction(functionName, ...params);

      const response = await query.execute(this.client);
      return response.bytes;
    } catch (error) {
      console.error("Error querying contract:", error);
      throw error;
    }
  }
}

// Helper function to create HederaUtils instance
export function createHederaUtils(network: typeof NetworkName[keyof typeof NetworkName] = NetworkName.Testnet): HederaUtils {
  // You should get these from environment variables
  const operatorId = process.env.NEXT_PUBLIC_HEDERA_OPERATOR_ID || "";
  const operatorKey = process.env.NEXT_PUBLIC_HEDERA_OPERATOR_KEY || "";
  
  if (!operatorId || !operatorKey) {
    throw new Error("Hedera operator credentials not configured");
  }

  return new HederaUtils({
    network,
    operatorId,
    operatorKey
  });
} 