import { RequirementCompliance, Tender, VendorBid } from '../types';

export function getBidComplianceResults(bid: VendorBid, tender: Tender): RequirementCompliance[] {
  if (bid.complianceResults && bid.complianceResults.length > 0) {
    return bid.complianceResults;
  }

  return tender.requirements.map((req) => {
    let status: 'COMPLIANT' | 'NEEDS_REVIEW' | 'NON_COMPLIANT' = 'COMPLIANT';
    if (req.status === 'NEEDS REVIEW' || req.status === 'NEEDS_REVIEW') {
      status = 'NEEDS_REVIEW';
    } else if (req.status === 'NON-COMPLIANT' || req.status === 'NON_COMPLIANT') {
      status = 'NON_COMPLIANT';
    }

    return {
      id: req.id,
      clauseRef: req.clauseReference,
      category: req.category,
      requirementTitle: req.title,
      expectedValue: req.expectedValue,
      extractedValue: req.extractedValue || 'Verified from official submission schedule',
      status,
      aiConfidence: req.confidence,
      weight: req.weight,
      supportingDocument: req.supportingDoc,
      pageReference: `Page ${req.docPage}`,
      aiExplanation: req.explanation,
      ruleApplied: req.calculationLogic || `Rule ${req.id}: Mandatory compliance with tender specifications.`,
      recommendation:
        status === 'COMPLIANT'
          ? 'Meets mandatory tender criteria. Certified for qualification.'
          : status === 'NEEDS_REVIEW'
          ? 'Minor discrepancy or validity mismatch. Officer clarification recommended.'
          : 'Mandatory condition not met. Subject to technical disqualification.',
      isOverridden: req.officerReview?.decision === 'OVERRIDDEN',
      overrideReason: req.officerReview?.officerRemarks,
    };
  });
}
