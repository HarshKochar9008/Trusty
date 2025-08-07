# Issuer Dashboard - Example Details & Usage Guide

## 📋 **Dashboard Overview**

The Issuer Dashboard allows healthcare providers to create and issue health records on the Hedera blockchain with sustainability tracking and SDG goal alignment.

> **🚀 Real Blockchain Integration**: When you have `OPERATOR_ID`, `OPERATOR_KEY`, and `HEDERA_TOPIC_ID` configured in your `.env.local` file, the system will automatically submit real transactions to the Hedera testnet and generate actual HashScan URLs that you can verify on the blockchain.

## 🏥 **Sample Health Record Examples**

### **Example 1: Vaccination Campaign Record**

```json
{
  "patientName": "Sarah Johnson",
  "patientId": "P-2024-001",
  "recordType": "Vaccination Record",
  "description": "Annual flu vaccination administered as part of community health initiative. Patient received comprehensive health screening including blood pressure, BMI, and diabetes risk assessment.",
  "issuer": "Dr. Michael Chen - Community Health Center",
  "date": "2024-12-15",
  "sustainabilityTags": ["Vaccination", "Rural Outreach", "Preventive Care", "Public Health Campaign"],
  "sdgGoals": ["SDG 3 - Good Health and Well-being", "SDG 10 - Reduced Inequalities", "SDG 11 - Sustainable Cities"],
  "impactScore": 85,
  "status": "issued",
  "transactionId": "0.0.6399272@1754533030.451066803",
  "hashscanUrl": "https://hashscan.io/testnet/transaction/0.0.6399272@1754533030.451066803",
  "note": "Example of a real transaction ID format. Each new record will generate a unique transaction ID on the Hedera blockchain."
}
```

### **Example 2: Mental Health Support Record**

```json
{
  "patientName": "Alex Rodriguez",
  "patientId": "P-2024-002",
  "recordType": "Mental Health Assessment",
  "description": "Comprehensive mental health evaluation including depression screening, anxiety assessment, and stress management counseling. Patient enrolled in telemedicine follow-up program.",
  "issuer": "Dr. Emily Watson - Mental Health Clinic",
  "date": "2024-12-14",
  "sustainabilityTags": ["Mental Health", "Telemedicine", "Preventive Care"],
  "sdgGoals": ["SDG 3 - Good Health and Well-being", "SDG 4 - Quality Education"],
  "impactScore": 75,
  "status": "draft"
}
```

### **Example 3: Emergency Response Record**

```json
{
  "patientName": "Emergency Response Team",
  "patientId": "ER-2024-003",
  "recordType": "Disaster Response Activity",
  "description": "Emergency medical response during natural disaster. Provided first aid, emergency transportation, and coordinated with local hospitals. Served 150+ affected individuals.",
  "issuer": "Dr. James Wilson - Emergency Response Coordinator",
  "date": "2024-12-13",
  "sustainabilityTags": ["Emergency Care", "Disaster Response", "Public Health Campaign"],
  "sdgGoals": ["SDG 3 - Good Health and Well-being", "SDG 11 - Sustainable Cities", "SDG 13 - Climate Action"],
  "impactScore": 95,
  "status": "issued"
}
```

### **Example 4: Rural Health Outreach**

```json
{
  "patientName": "Rural Community Health Program",
  "patientId": "RCH-2024-004",
  "recordType": "Community Health Initiative",
  "description": "Mobile health clinic providing basic healthcare services to underserved rural communities. Services included health screenings, vaccinations, and health education workshops.",
  "issuer": "Dr. Maria Garcia - Rural Health Initiative",
  "date": "2024-12-12",
  "sustainabilityTags": ["Rural Outreach", "Vaccination", "Medical Training", "Equipment Donation"],
  "sdgGoals": ["SDG 1 - No Poverty", "SDG 3 - Good Health and Well-being", "SDG 10 - Reduced Inequalities"],
  "impactScore": 90,
  "status": "issued"
}
```

## 🎯 **SDG Goals Available**

| Goal | Name | Healthcare Relevance |
|------|------|-------------------|
| **SDG 1** | No Poverty | Healthcare access for low-income communities |
| **SDG 3** | Good Health and Well-being | Core healthcare objectives |
| **SDG 4** | Quality Education | Health literacy and medical training |
| **SDG 5** | Gender Equality | Women's health and reproductive care |
| **SDG 6** | Clean Water and Sanitation | Public health and disease prevention |
| **SDG 10** | Reduced Inequalities | Healthcare access for marginalized groups |
| **SDG 11** | Sustainable Cities | Urban health infrastructure |
| **SDG 13** | Climate Action | Environmental health impacts |
| **SDG 16** | Peace and Justice | Healthcare in conflict zones |
| **SDG 17** | Partnerships | International health collaborations |

## 🏷️ **Health Impact Tags**

### **Primary Care Tags**
- **Vaccination** - Immunization programs
- **Preventive Care** - Health screenings and checkups
- **Mental Health** - Psychological support services
- **Child Health** - Pediatric care and development

### **Specialized Care Tags**
- **Emergency Care** - Urgent medical services
- **Chronic Disease Management** - Long-term condition care
- **Telemedicine** - Remote healthcare delivery
- **Medical Research** - Clinical studies and trials

### **Community Health Tags**
- **Rural Outreach** - Underserved area services
- **Public Health Campaign** - Community education
- **Disaster Response** - Emergency medical aid
- **Sanitation** - Hygiene and public health

### **Support Services Tags**
- **Medical Training** - Healthcare worker education
- **Equipment Donation** - Medical device provision
- **Blood Donation** - Blood bank services
- **Organ Transplant** - Transplant coordination
- **Palliative Care** - End-of-life support
- **Rehabilitation** - Recovery and therapy services

## 📊 **Impact Score Calculation**

The impact score (0-100) is calculated based on:
- **Base Score**: 50 points
- **SDG Goals**: +10 points per goal
- **Health Tags**: +5 points per tag
- **Maximum Score**: 100 points

### **Example Calculations**

**High Impact Record (95 points):**
- 4 SDG Goals: 40 points
- 1 Health Tag: 5 points
- Base Score: 50 points
- **Total**: 95 points

**Medium Impact Record (75 points):**
- 2 SDG Goals: 20 points
- 1 Health Tag: 5 points
- Base Score: 50 points
- **Total**: 75 points

## 🔄 **Workflow Steps**

### **1. Create New Record**
1. Fill in patient information (name, ID, record type)
2. Add detailed description of healthcare activity
3. Select relevant SDG goals (minimum 1)
4. Choose health impact tags (minimum 1)
5. Review impact score calculation
6. Click "Add Record" to save as draft

### **2. Issue Record on Blockchain**
1. Review draft record details
2. Click "Issue on Blockchain" button
3. Record is submitted to Hedera Consensus Service
4. Transaction ID and HashScan URL are generated
5. Record status changes to "issued"

### **3. View Blockchain Details**
- **Transaction ID**: Unique blockchain identifier
- **HashScan URL**: Link to view transaction on Hedera explorer
- **Consensus Timestamp**: When record was confirmed on blockchain
- **Topic ID**: Hedera topic where record is stored

## 📈 **Dashboard Statistics**

The dashboard tracks:
- **Total Records**: All created records
- **Issued Records**: Successfully published on blockchain
- **Draft Records**: Pending blockchain submission
- **Average Impact Score**: Mean impact across all records
- **Top SDG Goal**: Most frequently selected goal
- **Top Health Tag**: Most commonly used tag

## 🎨 **UI Features**

### **Visual Elements**
- **Color-coded tags** with icons
- **SDG goal badges** with descriptions
- **Impact score indicators** with progress bars
- **Status indicators** (draft/issued)
- **Blockchain transaction links**

### **Interactive Features**
- **Autocomplete** for SDG goals and health tags
- **Real-time impact score** calculation
- **Form validation** with helpful error messages
- **Success/error alerts** for user feedback
- **Responsive design** for mobile devices

## 🚀 **Getting Started**

1. **Access the Dashboard**: Navigate to `/issuer-dashboard`
2. **Connect Wallet**: Use the wallet connection in the header
3. **Create Your First Record**: Use the examples above as templates
4. **Test the Features**: Try different combinations of SDG goals and tags
5. **Issue on Blockchain**: Experience the full blockchain integration

## 💡 **Best Practices**

- **Be Specific**: Use detailed descriptions for better impact tracking
- **Select Relevant Goals**: Choose SDG goals that directly relate to your activity
- **Use Multiple Tags**: Combine different health impact areas for comprehensive tracking
- **Review Before Issuing**: Double-check all information before blockchain submission
- **Monitor Impact**: Track your dashboard statistics to measure healthcare impact

This dashboard transforms healthcare record-keeping into a sustainable impact tracking system with blockchain immutability! 🌟 