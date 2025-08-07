import { NextRequest, NextResponse } from 'next/server';

// Mock verified documents data
const mockVerifiedDocuments = [
  {
    transactionId: "0.0.123456@1705312200.123456789",
    sequenceNumber: 123456,
    consensusTimestamp: "1705312200.123456789",
    hash: "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234",
    timestamp: "2024-01-15T10:30:00Z",
    status: "verified",
    aiVerification: {
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
        riskLevel: "low",
        recommendations: ["Document appears valid", "Consider additional verification for high-value records"]
      }
    },
    model: "trusty-ai-v1",
    message: JSON.stringify({
      status: "verified",
      aiVerification: {
        isValid: true,
        confidence: 0.95,
        summary: {
          totalChecks: 10,
          passedChecks: 8,
          riskLevel: "low"
        }
      }
    })
  },
  {
    transactionId: "0.0.789012@1705316300.987654321",
    sequenceNumber: 789012,
    consensusTimestamp: "1705316300.987654321",
    hash: "0x987654321fedcba987654321fedcba987654321fedcba987654321fedcba9876",
    timestamp: "2024-01-15T11:45:00Z",
    status: "verified",
    aiVerification: {
      isValid: true,
      confidence: 0.88,
      verificationMethods: {
        llm: {
          confidence: 0.85,
          analysis: "Document content appears legitimate with minor concerns"
        },
        fraud: {
          fraudDetected: false,
          riskScore: 0.25
        },
        medical: {
          medicallyValid: true,
          complianceScore: 0.82
        },
        anomaly: {
          anomaliesDetected: false,
          anomalyScore: 0.18
        }
      },
      summary: {
        totalChecks: 10,
        passedChecks: 7,
        riskLevel: "medium",
        recommendations: ["Review document formatting", "Consider additional verification"]
      }
    },
    model: "trusty-ai-v1",
    message: JSON.stringify({
      status: "verified",
      aiVerification: {
        isValid: true,
        confidence: 0.88,
        summary: {
          totalChecks: 10,
          passedChecks: 7,
          riskLevel: "medium"
        }
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