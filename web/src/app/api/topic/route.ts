import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock Hedera topic information
    const topicInfo = {
      topicId: process.env.HEDERA_TOPIC_ID || "0.0.123456",
      memo: "Trusty Health Records Topic",
      runningHash: "0x1234567890abcdef",
      sequenceNumber: 42,
      expirationTime: "2025-12-31T23:59:59Z",
      autoRenewAccountId: "0.0.654321",
      autoRenewPeriod: "7776000" // 90 days in seconds
    };

    return NextResponse.json(topicInfo);

  } catch (error: any) {
    console.error('Error fetching topic info:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch topic information' },
      { status: 500 }
    );
  }
} 