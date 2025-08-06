// Guardian Policy Templates for Health Record Verification
// Compatible with Hedera Guardian framework

export interface GuardianPolicy {
  id: string;
  name: string;
  description: string;
  version: string;
  policyTag: string;
  owner: string;
  topicId: string;
  policyRoles: PolicyRole[];
  policyTokens: PolicyToken[];
  policyTopics: PolicyTopic[];
  policyPolicies: PolicyPolicy[];
  policyBlocks: PolicyBlock[];
  policyEvents: PolicyEvent[];
  policyArtifacts: PolicyArtifact[];
  policyTools: PolicyTool[];
  policyModules: PolicyModule[];
}

interface PolicyRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface PolicyToken {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  adminKey: string;
  supplyKey: string;
  freezeKey: string;
  wipeKey: string;
  kycKey: string;
  pauseKey: string;
}

interface PolicyTopic {
  id: string;
  name: string;
  description: string;
  owner: string;
  policyId: string;
  type: string;
}

interface PolicyPolicy {
  id: string;
  name: string;
  description: string;
  version: string;
  policyTag: string;
  owner: string;
  topicId: string;
}

interface PolicyBlock {
  id: string;
  name: string;
  description: string;
  blockType: string;
  blockData: any;
  blockTag: string;
  blockOwner: string;
  blockTopicId: string;
}

interface PolicyEvent {
  id: string;
  name: string;
  description: string;
  eventType: string;
  eventData: any;
  eventTag: string;
  eventOwner: string;
  eventTopicId: string;
}

interface PolicyArtifact {
  id: string;
  name: string;
  description: string;
  artifactType: string;
  artifactData: any;
  artifactTag: string;
  artifactOwner: string;
  artifactTopicId: string;
}

interface PolicyTool {
  id: string;
  name: string;
  description: string;
  toolType: string;
  toolData: any;
  toolTag: string;
  toolOwner: string;
  toolTopicId: string;
}

interface PolicyModule {
  id: string;
  name: string;
  description: string;
  moduleType: string;
  moduleData: any;
  moduleTag: string;
  moduleOwner: string;
  moduleTopicId: string;
}

// Health Record Issuer Policy
export const HEALTH_RECORD_ISSUER_POLICY: GuardianPolicy = {
  id: "health-record-issuer-policy",
  name: "Health Record Issuer Policy",
  description: "Simple policy for health record issuers with SDG validation",
  version: "1.0.0",
  policyTag: "healthcare-sustainability",
  owner: "trusty-health-system",
  topicId: process.env.HEDERA_TOPIC_ID || "",
  policyRoles: [
    {
      id: "health-record-issuer",
      name: "Health Record Issuer",
      description: "Authorized healthcare provider that can issue health records",
      permissions: [
        "CREATE_HEALTH_RECORD",
        "UPDATE_HEALTH_RECORD",
        "VIEW_OWN_RECORDS"
      ]
    }
  ],
  policyTokens: [],
  policyTopics: [
    {
      id: "health-records-topic",
      name: "Health Records Topic",
      description: "Topic for health record transactions",
      owner: "trusty-health-system",
      policyId: "health-record-issuer-policy",
      type: "HCS"
    }
  ],
  policyPolicies: [],
  policyBlocks: [
    {
      id: "sdg-validation-block",
      name: "SDG Validation Block",
      description: "Validates SDG goals and sustainability tags",
      blockType: "VALIDATION",
      blockData: {
        validationRules: [
          {
            field: "sdgGoals",
            required: true,
            minCount: 1,
            allowedValues: ["SDG 1", "SDG 2", "SDG 3", "SDG 4", "SDG 5", "SDG 6", "SDG 10", "SDG 11", "SDG 13", "SDG 16", "SDG 17"]
          },
          {
            field: "sustainabilityTags",
            required: true,
            minCount: 1,
            allowedValues: [
              "Vaccination", "Rural Outreach", "Maternal Health", "Child Health", "Mental Health",
              "Emergency Care", "Preventive Care", "Chronic Disease Management", "Telemedicine",
              "Medical Research", "Public Health Campaign", "Disaster Response", "Nutrition",
              "Sanitation", "Medical Training", "Equipment Donation", "Blood Donation",
              "Organ Transplant", "Palliative Care", "Rehabilitation"
            ]
          }
        ]
      },
      blockTag: "validation",
      blockOwner: "trusty-health-system",
      blockTopicId: process.env.HEDERA_TOPIC_ID || ""
    }
  ],
  policyEvents: [
    {
      id: "health-record-issued",
      name: "Health Record Issued",
      description: "Event triggered when a health record is issued",
      eventType: "RECORD_ISSUED",
      eventData: {
        recordId: "string",
        issuer: "string",
        timestamp: "string",
        sdgGoals: "string[]",
        sustainabilityTags: "string[]"
      },
      eventTag: "issuance",
      eventOwner: "trusty-health-system",
      eventTopicId: process.env.HEDERA_TOPIC_ID || ""
    }
  ],
  policyArtifacts: [
    {
      id: "health-record-schema",
      name: "Health Record Schema",
      description: "JSON schema for health records with SDG metadata",
      artifactType: "JSON_SCHEMA",
      artifactData: {
        type: "object",
        required: ["patientName", "recordType", "issuer", "date", "sustainabilityTags", "sdgGoals"],
        properties: {
          patientName: { type: "string" },
          patientId: { type: "string" },
          recordType: { type: "string" },
          issuer: { type: "string" },
          date: { type: "string", format: "date" },
          sustainabilityTags: { type: "array", items: { type: "string" } },
          sdgGoals: { type: "array", items: { type: "string" } },
          description: { type: "string" },
          status: { type: "string", enum: ["draft", "issued"] }
        }
      },
      artifactTag: "schema",
      artifactOwner: "trusty-health-system",
      artifactTopicId: process.env.HEDERA_TOPIC_ID || ""
    }
  ],
  policyTools: [
    {
      id: "sdg-validator",
      name: "SDG Validator",
      description: "Tool for validating SDG goals and sustainability tags",
      toolType: "VALIDATION_TOOL",
      toolData: {
        validationFunction: "validateSDGGoals",
        parameters: {
          requiredSDGs: ["SDG 3"],
          optionalSDGs: ["SDG 1", "SDG 2", "SDG 4", "SDG 5", "SDG 6", "SDG 10", "SDG 11", "SDG 13", "SDG 16", "SDG 17"]
        }
      },
      toolTag: "validation",
      toolOwner: "trusty-health-system",
      toolTopicId: process.env.HEDERA_TOPIC_ID || ""
    }
  ],
  policyModules: [
    {
      id: "sustainability-module",
      name: "Sustainability Module",
      description: "Module for handling sustainability-related functionality",
      moduleType: "SUSTAINABILITY",
      moduleData: {
        carbonFootprintCalculation: true,
        sdgTracking: true
      },
      moduleTag: "sustainability",
      moduleOwner: "trusty-health-system",
      moduleTopicId: process.env.HEDERA_TOPIC_ID || ""
    }
  ]
};

// Validation functions
export const validateSDGGoals = (sdgGoals: string[]): boolean => {
  const requiredSDGs = ["SDG 3"];
  const allowedSDGs = ["SDG 1", "SDG 2", "SDG 3", "SDG 4", "SDG 5", "SDG 6", "SDG 10", "SDG 11", "SDG 13", "SDG 16", "SDG 17"];
  
  // Check if required SDGs are present
  const hasRequiredSDGs = requiredSDGs.every(sdg => sdgGoals.includes(sdg));
  
  // Check if all SDGs are allowed
  const allSDGsAllowed = sdgGoals.every(sdg => allowedSDGs.includes(sdg));
  
  return hasRequiredSDGs && allSDGsAllowed;
};

export const validateSustainabilityTags = (tags: string[]): boolean => {
  const allowedTags = [
    "Vaccination", "Rural Outreach", "Maternal Health", "Child Health", "Mental Health",
    "Emergency Care", "Preventive Care", "Chronic Disease Management", "Telemedicine",
    "Medical Research", "Public Health Campaign", "Disaster Response", "Nutrition",
    "Sanitation", "Medical Training", "Equipment Donation", "Blood Donation",
    "Organ Transplant", "Palliative Care", "Rehabilitation"
  ];
  
  return tags.every(tag => allowedTags.includes(tag));
};

export const validateLocation = (location: any): boolean => {
  return (
    location &&
    typeof location.country === 'string' && location.country.length > 0 &&
    typeof location.region === 'string' && location.region.length > 0 &&
    typeof location.latitude === 'number' && location.latitude >= -90 && location.latitude <= 90 &&
    typeof location.longitude === 'number' && location.longitude >= -180 && location.longitude <= 180
  );
}; 