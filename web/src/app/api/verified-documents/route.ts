import { NextRequest, NextResponse } from 'next/server';

// Mock verified documents data
const mockVerifiedDocuments = [
  {
    transactionId: "2024-01-15T10:30:00Z",
    sequenceNumber: 1,
    consensusTimestamp: "2024-01-15T10:30:00Z",
    hash: "hash_123456789",
    timestamp: "2024-01-15T10:30:00Z",
    status: "verified",
    aiVerification: {
      confidence: 0.95,
      riskLevel: "low",
      passedChecks: 8,
      totalChecks: 10,
      verificationMethods: ["OCR", "Data Validation", "Format Check"],
      recommendations: ["Document appears valid"]
    },
    model: "trusty-ai-v1",
    message: JSON.stringify({
      status: "verified",
      aiVerification: {
        confidence: 0.95,
        riskLevel: "low",
        passedChecks: 8,
        totalChecks: 10
      }
    })
  },
  {
    transactionId: "2024-01-15T11:45:00Z",
    sequenceNumber: 2,
    consensusTimestamp: "2024-01-15T11:45:00Z",
    hash: "hash_987654321",
    timestamp: "2024-01-15T11:45:00Z",
    status: "verified",
    aiVerification: {
      confidence: 0.88,
      riskLevel: "medium",
      passedChecks: 7,
      totalChecks: 10,
      verificationMethods: ["OCR", "Data Validation"],
      recommendations: ["Review document formatting"]
    },
    model: "trusty-ai-v1",
    message: JSON.stringify({
      status: "verified",
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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Return mock data for now
    const limitedDocuments = mockVerifiedDocuments.slice(0, limit);
    
    return NextResponse.json({
      verifiedDocuments: limitedDocuments,
      total: limitedDocuments.length
    });

  } catch (error: any) {
    console.error('Error fetching verified documents:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch verified documents' },
      { status: 500 }
    );
  }
} 