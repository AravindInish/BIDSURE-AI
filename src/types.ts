export type TenderStatus = 'Draft' | 'Published' | 'Under Technical Evaluation' | 'Financial Evaluation' | 'Awarded' | 'Cancelled';

export type ComplianceStatus = 'COMPLIANT' | 'NEEDS_REVIEW' | 'NON_COMPLIANT' | 'NEEDS REVIEW' | 'NON-COMPLIANT';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RequirementCategory = 'Eligibility' | 'Financial' | 'Technical' | 'Legal' | 'Experience';

export interface Requirement {
  id: string;
  category: RequirementCategory | string;
  title: string;
  clauseReference: string;
  expectedValue: string;
  extractedValue?: string;
  weight: number; // percentage or score weight
  mandatory: boolean;
  status: ComplianceStatus;
  confidence: number; // 0 - 100
  supportingDoc: string;
  docPage: number;
  explanation: string;
  calculationLogic?: string;
  officerReview?: {
    reviewed: boolean;
    decision: 'ACCEPTED' | 'OVERRIDDEN' | 'MANUAL_REVIEW_REQUESTED';
    officerRemarks?: string;
    reviewedAt?: string;
    reviewedBy?: string;
  };
}

export interface RequirementCompliance {
  id: string;
  clauseRef: string;
  category: string;
  requirementTitle: string;
  expectedValue: string;
  extractedValue: string;
  status: 'COMPLIANT' | 'NEEDS_REVIEW' | 'NON_COMPLIANT';
  aiConfidence: number;
  weight: number;
  supportingDocument: string;
  pageReference: string;
  aiExplanation: string;
  ruleApplied: string;
  recommendation: string;
  isOverridden?: boolean;
  overrideReason?: string;
}

export interface Tender {
  id: string;
  tenderId: string;
  title: string;
  department: string;
  procuringOrganization: string;
  publishedDate: string;
  closingDate: string;
  estimatedValue: string;
  description: string;
  requirementsCount: number;
  bidsCount: number;
  status: TenderStatus;
  requirements: Requirement[];
}

export interface VendorDocument {
  id: string;
  name: string;
  category: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'JPG' | 'PNG' | string;
  size: string;
  uploadedAt: string;
  uploadStatus: 'Uploaded' | 'Processing' | 'Extracted' | 'Error' | string;
  aiConfidence: number;
  verificationStatus: 'Verified' | 'Flagged' | 'Pending Review' | string;
  pageCount: number;
  extractedData: Record<string, string>;
  previewContent?: {
    title: string;
    subtitle: string;
    issuedBy: string;
    issueDate: string;
    validUntil?: string;
    registrationNumber?: string;
    keyHighlights: { label: string; value: string; isMatch?: boolean }[];
    notes?: string;
  };
}

export interface Contradiction {
  id: string;
  parameter: string;
  comparisonItem?: string;
  doc1Name: string;
  doc1Value: string;
  doc2Name: string;
  doc2Value: string;
  docAName?: string;
  docAValue?: string;
  docBName?: string;
  docBValue?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
}

export type ConsistencyCheck = Contradiction;

export interface RiskCategoryBreakdown {
  id?: string;
  factor?: string;
  name: string;
  score: number;
  maxScore: number;
  description: string;
  status?: 'Low' | 'Moderate' | 'High' | string;
}

export type RiskFactor = RiskCategoryBreakdown;

export interface VendorBid {
  id: string;
  tenderId: string;
  vendorId: string;
  vendorName: string;
  gstin: string;
  pan: string;
  state: string;
  msmeType: 'Micro' | 'Small' | 'Medium' | 'Non-MSME' | string;
  submittedAt: string;
  complianceScore: number; // 0 - 100
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  status: 'Under Review' | 'Flagged for Clarification' | 'Qualified' | 'Disqualified' | string;
  passedCount: number;
  reviewCount: number;
  failedCount: number;
  missingDocsCount: number;
  missingDocumentsCount?: number;
  criticalIssuesCount: number;
  documents: VendorDocument[];
  complianceResults?: RequirementCompliance[];
  contradictions: Contradiction[];
  consistencyChecks?: ConsistencyCheck[];
  riskBreakdown: RiskCategoryBreakdown[];
  aiRiskSummary: string;
  aiRiskExplanation?: string;
  officerRemarks?: string;
  officerDecision?: string | {
    status: 'Qualified' | 'Disqualified' | 'Needs Clarification' | string;
    remarks: string;
    decidedBy: string;
    decidedAt: string;
    signatureHash: string;
  };
}

export interface VendorProfile {
  id: string;
  name: string;
  legalEntity: string;
  gemSellerId: string;
  gstin: string;
  pan: string;
  msmeStatus: string;
  registeredState: string;
  registeredCity: string;
  companyType: string;
  yearsInBusiness: number;
  annualTurnover: string;
  certifications: string[];
  previousGovtExperience: string[];
  blacklistStatus: 'Clean' | 'Under Investigation' | 'Debarred';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  timeFormatted: string;
  user: string;
  role?: string;
  action: string;
  object: string;
  result: string;
  hash?: string;
  sha256Hash?: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
  relatedDoc?: string;
}
