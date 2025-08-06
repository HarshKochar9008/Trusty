export interface AIVerification {
  isValid: boolean;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  passedChecks: number;
  totalChecks: number;
  verificationMethods?: string[];
  summary?: {
    riskLevel: 'low' | 'medium' | 'high';
    passedChecks: number;
    totalChecks: number;
  };
}

export interface VerifiedDocument {
  transactionId: string;
  sequenceNumber: number;
  consensusTimestamp: string;
  hash: string;
  timestamp: string;
  status: 'verified' | 'failed';
  aiVerification: AIVerification;
  model: string;
  message: string;
}

export interface VerifiedDocumentsResponse {
  verifiedDocuments: VerifiedDocument[];
  total: number;
} 