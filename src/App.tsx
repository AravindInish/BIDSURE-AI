/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavItemKey } from './components/Sidebar';
import { CopilotDrawer } from './components/CopilotDrawer';
import { AiPipelineModal } from './components/AiPipelineModal';

import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { TendersView } from './views/TendersView';
import { VendorBidsView } from './views/VendorBidsView';
import { BidUploadView } from './views/BidUploadView';
import { DocVerificationView } from './views/DocVerificationView';
import { ComplianceView } from './views/ComplianceView';
import { RiskAnalysisView } from './views/RiskAnalysisView';
import { FinalDecisionView } from './views/FinalDecisionView';
import { ReportsView } from './views/ReportsView';
import { AuditTrailView } from './views/AuditTrailView';
import { SettingsView } from './views/SettingsView';

import { MOCK_TENDERS, MOCK_BIDS, MOCK_AUDIT_LOGS } from './data/mockData';
import { Tender, VendorBid, VendorDocument, AuditLog, RequirementCompliance } from './types';
import { getBidComplianceResults } from './utils/complianceAdapter';

export default function App() {
  // Authentication State (defaults to true for instant demo evaluation)
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavItemKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isAiPipelineOpen, setIsAiPipelineOpen] = useState(false);

  // Active Entities State
  const [tenders, setTenders] = useState<Tender[]>(MOCK_TENDERS);
  const [currentTender, setCurrentTender] = useState<Tender>(MOCK_TENDERS[0]);

  const [bids, setBids] = useState<VendorBid[]>(MOCK_BIDS);
  const [currentBid, setCurrentBid] = useState<VendorBid>(MOCK_BIDS[0]);

  const [activeDoc, setActiveDoc] = useState<VendorDocument>(MOCK_BIDS[0].documents[0]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  // Handlers for Entity selection
  const handleSelectTender = (tender: Tender) => {
    setCurrentTender(tender);
  };

  const handleSelectBid = (bid: VendorBid) => {
    setCurrentBid(bid);
    if (bid.documents && bid.documents.length > 0) {
      setActiveDoc(bid.documents[0]);
    }
  };

  // Add new audit log helper
  const addAuditLog = (action: string, object: string, result: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      user: 'Shri Vikram Sharma (Senior Procurement Officer)',
      action,
      object,
      result,
      sha256Hash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}...`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Document actions
  const handleUpdateExtractedData = (docId: string, updatedData: Record<string, string>) => {
    setCurrentBid((prev) => {
      const updatedDocs = prev.documents.map((d) => (d.id === docId ? { ...d, extractedData: updatedData } : d));
      return { ...prev, documents: updatedDocs };
    });
    addAuditLog('Document Extracted Metadata Corrected', `Document ID: ${docId}`, 'Values updated by officer');
  };

  const handleToggleFlagStatus = (docId: string, newStatus: 'Verified' | 'Flagged') => {
    setCurrentBid((prev) => {
      const updatedDocs = prev.documents.map((d) => (d.id === docId ? { ...d, verificationStatus: newStatus } : d));
      return { ...prev, documents: updatedDocs };
    });
    if (activeDoc.id === docId) {
      setActiveDoc((prev) => ({ ...prev, verificationStatus: newStatus }));
    }
    addAuditLog(
      newStatus === 'Flagged' ? 'Document Flagged for Scrutiny' : 'Document Cleared & Verified',
      `Document ID: ${docId}`,
      `Status set to ${newStatus}`
    );
  };

  // Compliance actions
  const handleAcceptResult = (complianceId: string) => {
    addAuditLog('Compliance Clause Accepted', `Clause: ${complianceId}`, 'Officer accepted AI determination');
    alert('AI determination accepted by officer and committed to verification audit trail.');
  };

  const handleRequestManualReview = (complianceId: string) => {
    addAuditLog('Clarification Requested', `Clause: ${complianceId}`, '48-hour clarification notice queued');
    alert('Clarification request logged. Notice generated for bidder.');
  };

  const handleOverrideResult = (
    complianceId: string,
    newStatus: 'COMPLIANT' | 'NEEDS_REVIEW' | 'NON_COMPLIANT',
    reason: string
  ) => {
    setCurrentBid((prev) => {
      const currentList = getBidComplianceResults(prev, currentTender);
      const updatedResults = currentList.map((r) => {
        if (r.id === complianceId) {
          return {
            ...r,
            status: newStatus,
            isOverridden: true,
            overrideReason: reason,
          };
        }
        return r;
      });

      const passed = updatedResults.filter((r) => r.status === 'COMPLIANT').length;
      const review = updatedResults.filter((r) => r.status === 'NEEDS_REVIEW').length;
      const failed = updatedResults.filter((r) => r.status === 'NON_COMPLIANT').length;

      // Recalculate score based on status
      const newScore = Math.min(100, Math.round((passed / updatedResults.length) * 100));

      return {
        ...prev,
        complianceResults: updatedResults,
        complianceScore: newScore,
        passedCount: passed,
        reviewCount: review,
        failedCount: failed,
      };
    });

    addAuditLog(
      'Officer Override Applied',
      `Clause: ${complianceId}`,
      `Status overridden to ${newStatus}. Reason: ${reason}`
    );
  };

  // Final Decision action
  const handleConfirmDecision = (
    decision: 'Qualified' | 'Disqualified' | 'Needs Clarification',
    remarks: string
  ) => {
    setCurrentBid((prev) => ({
      ...prev,
      officerDecision: decision,
      officerRemarks: remarks,
      status: decision === 'Qualified' ? 'Qualified' : decision === 'Disqualified' ? 'Disqualified' : 'Under Review',
    }));

    addAuditLog(
      'Final Procurement Determination Certified',
      `Bidder: ${currentBid.vendorName} (${currentTender.tenderId})`,
      `Outcome: ${decision}. Remarks: ${remarks.slice(0, 40)}...`
    );
  };

  // Reset demo to default state
  const handleResetDemo = () => {
    setTenders(MOCK_TENDERS);
    setCurrentTender(MOCK_TENDERS[0]);
    setBids(MOCK_BIDS);
    setCurrentBid(MOCK_BIDS[0]);
    setActiveDoc(MOCK_BIDS[0].documents[0]);
    setAuditLogs(MOCK_AUDIT_LOGS);
    setActiveTab('dashboard');
    addAuditLog('Demo Workspace Reset', 'System Session', 'Restored pristine SIH26100 evaluation scenario');
  };

  // Load demo bid package
  const handleLoadDemoPackage = () => {
    setCurrentBid(MOCK_BIDS[0]);
    setActiveDoc(MOCK_BIDS[0].documents[0]);
    setActiveTab('document-verification');
  };

  // Pipeline completion
  const handlePipelineComplete = () => {
    setActiveTab('compliance-analysis');
    addAuditLog(
      'AI Extraction Pipeline Executed',
      `Bidder: ${currentBid.vendorName}`,
      'All 7 extraction stages completed with OCR confidence 97%'
    );
  };

  // Inspect document from other tabs
  const handleInspectDocumentByName = (docName: string) => {
    const found = currentBid.documents.find((d) => d.name === docName);
    if (found) {
      setActiveDoc(found);
    }
    setActiveTab('document-verification');
  };

  // Calculate badge counters
  const flaggedDocsCount = currentBid.documents.filter((d) => d.verificationStatus === 'Flagged').length;
  const currentComplianceList = getBidComplianceResults(currentBid, currentTender);
  const reviewReqsCount = currentComplianceList.filter((r) => r.status === 'NEEDS_REVIEW').length;

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col text-slate-900 font-sans antialiased">
      {/* Top Header */}
      <Header
        currentTender={currentTender}
        tenders={tenders}
        onSelectTender={handleSelectTender}
        currentBid={currentBid}
        bids={bids}
        onSelectBid={handleSelectBid}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onResetDemo={handleResetDemo}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Workspace: Sidebar + Dynamic View Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          flaggedDocsCount={flaggedDocsCount}
          reviewReqsCount={reviewReqsCount}
          onSelectDemoScenario={() => {
            handleResetDemo();
            setActiveTab('compliance-analysis');
          }}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-16">
          {activeTab === 'dashboard' && (
            <DashboardView
              tenders={tenders}
              bids={bids}
              auditLogs={auditLogs}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectBid={(bid) => {
                handleSelectBid(bid);
              }}
            />
          )}

          {activeTab === 'tenders' && (
            <TendersView
              tenders={tenders}
              currentTender={currentTender}
              onSelectTender={handleSelectTender}
              onCreateTender={(newT) => {
                setTenders((prev) => [newT, ...prev]);
                setCurrentTender(newT);
                addAuditLog('New Tender Published', newT.tenderId, 'Tender created with AI extracted requirements');
              }}
              onEvaluateBids={(t) => {
                handleSelectTender(t);
                setActiveTab('vendor-bids');
              }}
            />
          )}

          {activeTab === 'vendor-bids' && (
            <VendorBidsView
              currentTender={currentTender}
              bids={bids}
              currentBid={currentBid}
              onSelectBid={handleSelectBid}
              onInspectCompliance={(b) => {
                handleSelectBid(b);
                setActiveTab('compliance-analysis');
              }}
            />
          )}

          {activeTab === 'document-verification' && (
            <div className="space-y-6">
              <BidUploadView
                currentTender={currentTender}
                currentBid={currentBid}
                tenders={tenders}
                bids={bids}
                onSelectTender={handleSelectTender}
                onSelectBid={handleSelectBid}
                onViewDocDetails={(doc) => setActiveDoc(doc)}
                onRunAiPipeline={() => setIsAiPipelineOpen(true)}
                onLoadDemoDocuments={handleLoadDemoPackage}
              />

              <DocVerificationView
                currentBid={currentBid}
                activeDoc={activeDoc}
                onSelectDoc={(d) => setActiveDoc(d)}
                onUpdateExtractedData={handleUpdateExtractedData}
                onToggleFlagStatus={handleToggleFlagStatus}
              />
            </div>
          )}

          {activeTab === 'compliance-analysis' && (
            <ComplianceView
              currentTender={currentTender}
              currentBid={currentBid}
              onAcceptResult={handleAcceptResult}
              onRequestManualReview={handleRequestManualReview}
              onOverrideResult={handleOverrideResult}
              onInspectDocument={handleInspectDocumentByName}
            />
          )}

          {activeTab === 'risk-analysis' && (
            <RiskAnalysisView
              currentTender={currentTender}
              currentBid={currentBid}
              onInspectDocument={handleInspectDocumentByName}
              onProceedToDecision={() => setActiveTab('final-decision')}
            />
          )}

          {activeTab === 'final-decision' && (
            <FinalDecisionView
              currentTender={currentTender}
              currentBid={currentBid}
              onConfirmDecision={handleConfirmDecision}
              onNavigateToReport={() => setActiveTab('reports')}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              currentTender={currentTender}
              currentBid={currentBid}
            />
          )}

          {activeTab === 'audit-trail' && (
            <AuditTrailView logs={auditLogs} />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Floating AI Copilot Assistant Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentTender={currentTender}
        currentBid={currentBid}
      />

      {/* 7-Step AI Pipeline Modal */}
      <AiPipelineModal
        isOpen={isAiPipelineOpen}
        onClose={() => setIsAiPipelineOpen(false)}
        vendorName={currentBid.vendorName}
        onComplete={handlePipelineComplete}
      />
    </div>
  );
}
