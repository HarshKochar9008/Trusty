# Trusty Health Record Verifier - Sustainability Features

## Overview

The Trusty Health Record Verifier has been extended with comprehensive sustainability features to qualify for the Hedera Hackathon Sustainability Track. This implementation focuses on social impact, transparency, decentralized verifiability, and energy efficiency using Hedera Guardian and network services.

## 🎯 Implemented Features

### Task 1: SDG Metadata Tagging ✅

**Location**: `web/src/app/issuer-dashboard/page.tsx`

**Features**:
- **SDG Goals Selection**: Predefined list of UN Sustainable Development Goals relevant to healthcare
- **Sustainability Tags**: Healthcare-specific impact tags (Vaccination, Rural Outreach, Maternal Health, etc.)
- **Validation**: Required SDG 3 (Good Health and Well-being) with optional additional goals
- **On-chain Storage**: SDG metadata stored via HCS and Guardian-compatible schema

**SDG Goals Supported**:
- SDG 1: No Poverty
- SDG 2: Zero Hunger  
- SDG 3: Good Health and Well-being (Required)
- SDG 4: Quality Education
- SDG 5: Gender Equality
- SDG 6: Clean Water and Sanitation
- SDG 10: Reduced Inequalities
- SDG 11: Sustainable Cities
- SDG 13: Climate Action
- SDG 16: Peace and Justice
- SDG 17: Partnerships

**Healthcare Impact Tags**:
- Vaccination, Rural Outreach, Maternal Health, Child Health, Mental Health
- Emergency Care, Preventive Care, Chronic Disease Management, Telemedicine
- Medical Research, Public Health Campaign, Disaster Response, Nutrition
- Sanitation, Medical Training, Equipment Donation, Blood Donation
- Organ Transplant, Palliative Care, Rehabilitation

### Task 2: Guardian-Compatible Policy Flow ✅

**Location**: `web/src/lib/guardianPolicies.ts`

**Features**:
- **Policy Templates**: Complete Guardian-compatible policy structure
- **Role-based Access**: Hospital, NGO, and Government issuer roles
- **Validation Rules**: SDG goals, sustainability tags, and location validation
- **Event Tracking**: Health record issuance and revocation events
- **Schema Compliance**: JSON schema for Guardian integration

**Policy Components**:
- **Roles**: Health Record Issuer, Government Auditor, NGO Issuer
- **Tokens**: Health Record Token (HRT) for ecosystem incentives
- **Blocks**: SDG validation and issuer verification blocks
- **Events**: Record issuance and revocation event tracking
- **Artifacts**: Health record schema with sustainability metadata

### Task 3: Geo-location Metadata ✅

**Location**: `web/src/app/issuer-dashboard/page.tsx`

**Features**:
- **Manual Entry**: Country, region, latitude, longitude fields
- **Auto-fetch**: Browser geolocation API integration
- **Validation**: Coordinate range validation (-90 to 90 lat, -180 to 180 long)
- **Storage**: Location data stored in record metadata
- **Privacy**: Location data can be anonymized for public reports

### Task 4: Carbon Footprint Efficiency Display ✅

**Location**: `web/src/components/CarbonFootprintDisplay.tsx`

**Features**:
- **Real-time Calculation**: Energy and carbon footprint per transaction
- **Blockchain Comparison**: Hedera vs Ethereum, Bitcoin, Solana
- **Efficiency Metrics**: 
  - Hedera: 0.00000122 kWh per transaction
  - Carbon: 0.0000006 kg CO2 per transaction
- **Visual Comparison**: Progress bars showing efficiency percentages
- **Integration**: Embedded in issuer dashboard and public reports

**Energy Efficiency Data**:
| Blockchain | Energy per Tx (kWh) | Carbon per Tx (kg CO2) | TPS | Efficiency vs Hedera |
|------------|-------------------|----------------------|-----|-------------------|
| Hedera | 0.00000122 | 0.0000006 | 10,000 | 100% |
| Ethereum | 0.0006 | 0.0003 | 15 | 0.2% |
| Bitcoin | 0.0007 | 0.00035 | 7 | 0.17% |
| Solana | 0.00000051 | 0.00000025 | 65,000 | 239% |

### Task 5: Transparent On-Chain Public Reporting ✅

**Location**: `web/src/app/public-reports/page.tsx`, `apiServer.js`

**Features**:
- **HCS Integration**: Real-time data from Hedera Consensus Service
- **Aggregated Statistics**: Records by type, issuer, location, SDG goals
- **Carbon Footprint Tracking**: Total energy and carbon emissions
- **Export Functionality**: CSV and JSON export with anonymized data
- **Public Dashboard**: Real-time statistics with refresh capability

**Report Metrics**:
- Total records issued
- Rural vaccination counts
- Maternal health records
- Emergency care records
- SDG goal breakdown
- Geographic distribution
- Top issuer statistics
- Carbon footprint totals

### Task 6: User Control Over Data (SSI Principles) ✅

**Location**: `web/src/app/user-dashboard/page.tsx`

**Features**:
- **DID Integration**: Decentralized Identifier management
- **Verifiable Credentials**: W3C-compliant VC format
- **Consent Management**: User-controlled data sharing with consent tokens
- **Record Management**: View, revoke, and re-issue capabilities
- **QR Code Generation**: Easy sharing via QR codes
- **VC Download**: Export verifiable credentials as JSON

**SSI Components**:
- **DID Document**: Ed25519VerificationKey2020 method
- **Verifiable Credentials**: HealthRecord VC type
- **Consent Tokens**: Unique tokens for data sharing authorization
- **Revocation Registry**: On-chain proof of record status

### Task 7: NGO & Government Issuer Roles ✅

**Location**: `web/src/app/issuer-dashboard/page.tsx`

**Features**:
- **Role Selection**: Hospital, NGO, Government agency roles
- **Permission Management**: Role-based access control
- **Digital Signatures**: Issuer metadata with organization details
- **Audit Trail**: Complete record of issuer actions
- **Compliance**: Guardian policy enforcement

**Role Permissions**:
- **Hospital**: Issue and verify health records
- **NGO**: Issue records with SDG tagging and rural outreach focus
- **Government**: Audit, validate claims, and report violations

### Task 8: Public Open Data Export (Anonymized) ✅

**Location**: `web/src/app/data-export/page.tsx`, `apiServer.js`

**Features**:
- **GDPR Compliance**: Article 25 - Data Protection by Design
- **Anonymization**: Complete removal of personal identifiers
- **Flexible Export**: JSON and CSV formats
- **Configurable Data**: Optional location, SDG, and carbon footprint data
- **Guardian Schema**: Compatible with Hedera Guardian framework
- **Research Ready**: Structured data for approved institutions

**Export Options**:
- Include/exclude location data
- Include/exclude SDG goals and sustainability tags
- Include/exclude carbon footprint data
- JSON or CSV format selection
- Guardian schema compliance

## 🏗️ Technical Architecture

### Frontend Components
- **Issuer Dashboard**: SDG tagging, location metadata, role management
- **User Dashboard**: SSI principles, consent management, VC handling
- **Public Reports**: Real-time statistics and transparency
- **Data Export**: Anonymized data export with compliance
- **Carbon Footprint Display**: Energy efficiency visualization

### Backend Services
- **Guardian Policies**: Complete policy framework
- **HCS Integration**: Real-time blockchain data
- **Anonymization Engine**: GDPR-compliant data processing
- **Export APIs**: Flexible data export endpoints
- **Validation Services**: SDG and sustainability tag validation

### Blockchain Integration
- **Hedera Consensus Service**: Immutable record storage
- **Guardian Framework**: Policy management and compliance
- **DID Resolution**: Decentralized identity management
- **VC Verification**: W3C verifiable credential validation

## 🌱 Sustainability Impact

### Environmental Benefits
- **99.9% Energy Efficiency**: Compared to traditional blockchains
- **Carbon Footprint Tracking**: Transparent environmental impact
- **Green Technology**: Hedera's energy-efficient consensus mechanism

### Social Impact
- **SDG Alignment**: Direct contribution to UN Sustainable Development Goals
- **Rural Healthcare**: Focus on underserved communities
- **Transparency**: Public reporting on healthcare impact
- **Accessibility**: User-controlled data sharing

### Economic Benefits
- **Cost Efficiency**: Minimal transaction costs
- **Scalability**: High throughput for healthcare systems
- **Interoperability**: Guardian framework compatibility
- **Compliance**: Built-in regulatory compliance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Hedera Testnet account
- Guardian framework (optional)

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Hedera credentials and Guardian configuration

# Start the development server
npm run dev
```

### Configuration
1. **Hedera Setup**: Configure testnet credentials in `.env`
2. **Guardian Integration**: Set up Guardian policies (optional)
3. **SDG Validation**: Customize SDG goals and sustainability tags
4. **Export Settings**: Configure anonymization and export options

## 📊 Usage Examples

### Creating a Health Record with SDG Tags
```typescript
const healthRecord = {
  patientName: "John Doe",
  recordType: "Vaccination Record",
  issuer: "Apollo Hospitals",
  sdgGoals: ["SDG 3", "SDG 1"],
  sustainabilityTags: ["Vaccination", "Rural Outreach"],
  location: {
    country: "India",
    region: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946
  }
};
```

### Exporting Anonymized Data
```bash
# JSON export with all data
GET /api/export/anonymized?format=json&location=true&sdg=true

# CSV export with limited data
GET /api/export/anonymized?format=csv&location=false&sdg=true
```

### Guardian Policy Integration
```typescript
import { HEALTH_RECORD_ISSUER_POLICY } from '@/lib/guardianPolicies';

// Validate SDG goals
const isValid = validateSDGGoals(record.sdgGoals);

// Validate sustainability tags
const isValidTags = validateSustainabilityTags(record.sustainabilityTags);
```

## 🔒 Privacy & Compliance

### GDPR Compliance
- **Data Minimization**: Only necessary data is collected
- **Anonymization**: Personal identifiers are removed
- **Consent Management**: User-controlled data sharing
- **Right to Erasure**: Record revocation capabilities

### Guardian Framework
- **Policy Enforcement**: Automated compliance checking
- **Audit Trail**: Complete transaction history
- **Schema Validation**: Structured data validation
- **Role-based Access**: Granular permission control

## 📈 Future Enhancements

### Planned Features
- **IPFS Integration**: Decentralized storage for large files
- **Advanced Analytics**: Machine learning for impact assessment
- **Mobile App**: Native mobile application
- **API Marketplace**: Third-party integrations
- **Cross-chain Bridge**: Multi-blockchain support

### Research Opportunities
- **Impact Measurement**: Quantifying SDG contributions
- **Carbon Accounting**: Detailed environmental impact analysis
- **Healthcare Outcomes**: Correlation with blockchain transparency
- **Economic Analysis**: Cost-benefit analysis of blockchain healthcare

## 🤝 Contributing

This project is open for contributions. Please see our contributing guidelines for:
- Code standards
- Testing requirements
- Documentation updates
- Feature proposals

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Hedera Hashgraph for the sustainable blockchain infrastructure
- UN Sustainable Development Goals for the impact framework
- Guardian framework for policy management
- W3C for verifiable credential standards

---

**Trusty Health Record Verifier** - Empowering sustainable healthcare through blockchain technology and social impact measurement. 