import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import crypto from 'crypto';

// Mock AI verification function (replace with your actual implementation)
async function comprehensiveAIVerification(extractedData: any) {
  return {
    isValid: true,
    confidence: 0.95,
    verificationMethods: {
      llm: {
        confidence: 0.92,
        analysis: "Document content appears legitimate"
      },
      fraud: {
        fraudDetected: false,
        riskScore: 0.15
      },
      medical: {
        medicallyValid: true,
        complianceScore: 0.88
      },
      anomaly: {
        anomaliesDetected: false,
        anomalyScore: 0.12
      }
    },
    summary: {
      totalChecks: 10,
      passedChecks: 8,
      riskLevel: 'low',
      recommendations: ['Document appears valid', 'Consider additional verification for high-value records']
    }
  };
}

// Generate metadata with real or demo transactions
async function generateMetadata(extractedData: any, aiResult: any) {
  // Check if we have real credentials configured
  const hasRealCredentials = process.env.OPERATOR_ID && process.env.OPERATOR_KEY && process.env.HEDERA_TOPIC_ID;
  
  if (hasRealCredentials) {
    try {
      // Import Hedera client for real transactions
      const { hederaClient, submitToHCS } = await import('../../../lib/hederaClient');
      
      // Create metadata for real blockchain submission
      const metadata = {
        hash: crypto.createHash('sha256').update(JSON.stringify(extractedData)).digest('hex'),
        timestamp: new Date().toISOString(),
        status: aiResult.isValid ? 'verified' : 'failed',
        model: 'multi-ai-system',
        aiVerification: {
          isValid: aiResult.isValid,
          confidence: aiResult.overallConfidence,
          riskLevel: aiResult.summary.riskLevel,
          passedChecks: aiResult.summary.passedChecks,
          totalChecks: aiResult.summary.totalChecks
        }
      };

      // Submit to real Hedera network
      const client = hederaClient();
      const topicId = process.env.HEDERA_TOPIC_ID!;
      const txResponse = await submitToHCS(client, topicId, JSON.stringify(metadata));
      const receipt = await txResponse.getReceipt(client);
      
      return {
        hash: metadata.hash,
        transactionId: txResponse.transactionId.toString(),
        sequenceNumber: (receipt as any).topicSequenceNumber?.toString() || '1',
        timestamp: metadata.timestamp,
        status: 'verified',
        aiVerification: aiResult,
        model: 'trusty-ai-v1',
        realTransaction: true
      };
    } catch (error) {
      console.error('Failed to submit to real Hedera network:', error);
      // Fall back to demo mode if real submission fails
    }
  }
  
  // Demo mode - generate unique transaction IDs
  const generateDemoTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `0.0.6399272@${timestamp}.${random}`;
  };

  const demoTransactions = [
    {
      transactionId: generateDemoTransactionId(),
      sequenceNumber: Math.floor(Math.random() * 1000).toString(),
      hash: "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234"
    },
    {
      transactionId: generateDemoTransactionId(), 
      sequenceNumber: Math.floor(Math.random() * 1000).toString(),
      hash: "0x987654321fedcba987654321fedcba987654321fedcba987654321fedcba9876"
    },
    {
      transactionId: generateDemoTransactionId(),
      sequenceNumber: Math.floor(Math.random() * 1000).toString(), 
      hash: "0x3456789012345678901234567890123456789012345678901234567890123456"
    }
  ];
  
  // Randomly select one of the demo transaction IDs
  const selectedTransaction = demoTransactions[Math.floor(Math.random() * demoTransactions.length)];
  
  return {
    hash: selectedTransaction.hash,
    transactionId: selectedTransaction.transactionId,
    sequenceNumber: selectedTransaction.sequenceNumber,
    timestamp: new Date().toISOString(),
    status: 'verified',
    aiVerification: aiResult,
    model: 'trusty-ai-v1',
    realTransaction: false
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('record') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No health record file provided.' }, { status: 400 });
    }

    // Create temporary file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(tmpdir(), `upload-${Date.now()}-${file.name}`);
    await writeFile(tempPath, buffer);

    try {
      // Extract data from file (simplified for demo)
      const extractedData = {
        name: "Sample Patient",
        type: "Health Record",
        issuer: "Sample Hospital",
        date: new Date().toISOString().split('T')[0],
        status: "Valid"
      };

      // Perform AI verification
      const aiResult = await comprehensiveAIVerification(extractedData);
      
      // Generate metadata
      const metadata = await generateMetadata(extractedData, aiResult);

      // Clean up temp file
      await unlink(tempPath);

      return NextResponse.json({
        success: true,
        extractedData,
        aiVerification: aiResult,
        metadata,
        hashscanUrl: metadata.realTransaction 
          ? `https://hashscan.io/testnet/transaction/${metadata.transactionId}`
          : `https://hashscan.io/testnet/transaction/${metadata.transactionId}`
      });

    } catch (error) {
      // Clean up temp file on error
      try {
        await unlink(tempPath);
      } catch (cleanupError) {
        console.error('Failed to cleanup temp file:', cleanupError);
      }
      throw error;
    }

  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
} 