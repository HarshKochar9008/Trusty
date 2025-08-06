import { NextRequest, NextResponse } from 'next/server';

// Mock topic messages data
const mockMessages = [
  {
    sequenceNumber: 1,
    consensusTimestamp: "2024-01-15T10:30:00Z",
    message: JSON.stringify({
      status: "verified",
      hash: "hash_123456789",
      timestamp: "2024-01-15T10:30:00Z",
      aiVerification: {
        confidence: 0.95,
        riskLevel: "low",
        passedChecks: 8,
        totalChecks: 10
      }
    })
  },
  {
    sequenceNumber: 2,
    consensusTimestamp: "2024-01-15T11:45:00Z",
    message: JSON.stringify({
      status: "verified",
      hash: "hash_987654321",
      timestamp: "2024-01-15T11:45:00Z",
      aiVerification: {
        confidence: 0.88,
        riskLevel: "medium",
        passedChecks: 7,
        totalChecks: 10
      }
    })
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      messages: mockMessages
    });

  } catch (error: any) {
    console.error('Error fetching topic messages:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch topic messages' },
      { status: 500 }
    );
  }
} 