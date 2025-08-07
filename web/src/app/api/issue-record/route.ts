import { NextRequest, NextResponse } from 'next/server';
import { hederaClient, submitToHCS } from '../../../lib/hederaClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      patientName, 
      patientId, 
      recordType, 
      description, 
      issuer, 
      date, 
      sustainabilityTags, 
      sdgGoals, 
      impactScore 
    } = body;

    // Validate required fields
    if (!patientName || !recordType || !issuer) {
      return NextResponse.json(
        { error: 'Missing required fields: patientName, recordType, issuer' },
        { status: 400 }
      );
    }

    // Demo mode for development (when credentials are not configured)
    const isDemoMode = !process.env.OPERATOR_ID || !process.env.OPERATOR_KEY;
    
    if (isDemoMode) {
      const demoRecord = {
        patientName,
        patientId,
        recordType,
        description,
        issuer,
        date,
        sustainabilityTags,
        sdgGoals,
        impactScore,
        timestamp: new Date().toISOString(),
        status: 'confirmed',
        version: '1.0',
        blockchain: 'hedera-hcs',
        transactionId: '0.0.123456@1234567890.123456789',
        consensusTimestamp: new Date().toISOString(),
        sequenceNumber: '1',
        hashscanUrl: 'https://hashscan.io/testnet/transaction/0.0.123456@1234567890.123456789',
        topicId: '0.0.123456',
        demo: true
      };

      return NextResponse.json({
        success: true,
        message: 'Health record successfully issued on blockchain (DEMO MODE)',
        record: demoRecord,
        note: 'This is a demo response. Set OPERATOR_ID and OPERATOR_KEY for real blockchain integration.'
      });
    }

    // Create the health record metadata
    const healthRecord = {
      patientName,
      patientId,
      recordType,
      description,
      issuer,
      date,
      sustainabilityTags,
      sdgGoals,
      impactScore,
      timestamp: new Date().toISOString(),
      status: 'issued',
      version: '1.0',
      blockchain: 'hedera-hcs'
    };

    // Get Hedera client
    let client;
    try {
      client = hederaClient();
    } catch (error) {
      console.error('Hedera client initialization failed:', error);
      return NextResponse.json(
        { 
          error: 'Hedera client initialization failed',
          details: error instanceof Error ? error.message : 'Unknown error',
          instructions: 'Please set OPERATOR_ID and OPERATOR_KEY environment variables. Get testnet credentials from https://portal.hedera.com'
        },
        { status: 500 }
      );
    }

    const topicId = process.env.HEDERA_TOPIC_ID;

    if (!topicId) {
      return NextResponse.json(
        { 
          error: 'HEDERA_TOPIC_ID not configured',
          instructions: 'Please set HEDERA_TOPIC_ID environment variable. You can create a topic using the Hedera portal or SDK.'
        },
        { status: 500 }
      );
    }

    // Submit to Hedera Consensus Service
    const txResponse = await submitToHCS(client, topicId, JSON.stringify(healthRecord));
    const receipt = await txResponse.getReceipt(client);

    // Get transaction details
    const transactionId = txResponse.transactionId.toString();
    const consensusTimestamp = (receipt as any).consensusTimestamp;
    const sequenceNumber = (receipt as any).topicSequenceNumber;

    // Create response with blockchain details
    const blockchainRecord = {
      ...healthRecord,
      transactionId,
      consensusTimestamp: consensusTimestamp?.toString(),
      sequenceNumber: sequenceNumber?.toString(),
      hashscanUrl: `https://hashscan.io/${process.env.HEDERA_NETWORK || 'testnet'}/transaction/${transactionId}`,
      topicId,
      status: 'confirmed'
    };

    return NextResponse.json({
      success: true,
      message: 'Health record successfully issued on blockchain',
      record: blockchainRecord
    });

  } catch (error: any) {
    console.error('Error issuing record on blockchain:', error);
    return NextResponse.json(
      { 
        error: 'Failed to issue record on blockchain',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 