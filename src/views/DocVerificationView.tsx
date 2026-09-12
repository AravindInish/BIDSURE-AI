import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Edit3,
  Flag,
  Save,
  MessageSquare,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Stamp
} from 'lucide-react';
import { VendorDocument, VendorBid } from '../types';

interface DocVerificationViewProps {
  currentBid: VendorBid;
  activeDoc: VendorDocument;
  onSelectDoc: (doc: VendorDocument) => void;
  onUpdateExtractedData: (docId: string, updatedData: Record<string, string>) => void;
  onToggleFlagStatus: (docId: string, newStatus: 'Verified' | 'Flagged') => void;
}

export const DocVerificationView: React.FC<DocVerificationViewProps> = ({
  currentBid,
  activeDoc,
  onSelectDoc,
  onUpdateExtractedData,
  onToggleFlagStatus,
}) => {
  const doc = activeDoc || (currentBid.documents && currentBid.documents.length > 0 ? currentBid.documents[0] : null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, string>>(doc?.extractedData || {});
  const [officerNote, setOfficerNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>([
    'Verified with CBDT / GSTN simulated schema. Entity is actively registered.',
  ]);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Sync edited fields when active document changes
  React.useEffect(() => {
    if (doc) {
      setEditedFields(doc.extractedData || {});
      setIsEditing(false);
    }
  }, [doc?.id]);

  if (!doc) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
        <FileText className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-base font-semibold text-slate-800">No Documents Available</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please upload or select a bid to view and verify statutory evidence.
        </p>
      </div>
    );
  }

  const handleSaveEdit = () => {
    onUpdateExtractedData(doc.id, editedFields);
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (officerNote.trim()) {
      setNotesList((prev) => [...prev, `${officerNote.trim()} — (Officer Vikram Sharma, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`]);
      setOfficerNote('');
    }
  };

  const isFlagged = doc.verificationStatus === 'Flagged';

  return (
    <div className="space-y-6">
      {/* Header and Document Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Document Verification & Evidence Studio
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              AI OCR & Entity Matching
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Split-screen document preview alongside AI entity extraction and officer review controls.
          </p>
        </div>

        {/* Document Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          {currentBid.documents.map((d) => {
            const isSelected = d.id === doc.id;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDoc(d)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B5D3B] text-white border-emerald-800 shadow-xs font-semibold'
                    : d.verificationStatus === 'Flagged'
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>{d.name.replace('.pdf', '')}</span>
                {d.verificationStatus === 'Flagged' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDE: Realistic Government Document Preview */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          {/* Document Viewer Toolbar */}
          <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2 font-mono font-medium">
              <span className="bg-emerald-900 text-white px-2 py-0.5 rounded text-[10px]">
                {doc.fileType}
              </span>
              <span className="truncate max-w-[260px] text-slate-800 font-bold">
                {doc.name}
              </span>
              <span className="text-slate-400">({doc.pageCount} Pages)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
                className="p-1 hover:bg-white rounded transition-colors text-slate-600 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-slate-700">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
                className="p-1 hover:bg-white rounded transition-colors text-slate-600 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Rendered Document Sheet */}
          <div className="p-6 bg-slate-200/50 flex justify-center overflow-x-auto min-h-[580px]">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-[520px] bg-white shadow-lg border border-slate-300 rounded-sm p-8 text-slate-800 flex flex-col justify-between transition-transform duration-200 relative select-none"
            >
              {/* Scanned Official Seal Watermark */}
              <div className="absolute right-6 top-6 opacity-20 border-4 border-emerald-900 rounded-full w-24 h-24 flex items-center justify-center pointer-events-none rotate-[-12deg]">
                <span className="text-[10px] font-bold text-center text-emerald-950 uppercase leading-tight font-serif">
                  GOVT OF INDIA<br />NIC / GeM<br />VERIFIED
                </span>
              </div>

              {/* Document Header */}
              <div>
                <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                  <div className="w-8 h-8 mx-auto mb-1 text-slate-700 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-[#0B5D3B]" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-serif">
                    {doc.previewContent?.title || doc.category}
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {doc.previewContent?.subtitle || 'Official Statutory Submission'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Issued by: {doc.previewContent?.issuedBy}
                  </p>
                </div>

                {/* Key Reference Line */}
                <div className="flex justify-between items-center text-[10px] text-slate-600 font-mono mb-4 bg-slate-50 p-2 rounded border border-slate-200">
                  <span>Reg / Ref: <strong>{doc.previewContent?.registrationNumber || 'DOC-REF-09824'}</strong></span>
                  <span>Date: {doc.previewContent?.issueDate}</span>
                </div>

                {/* Simulated Scanned Paragraph */}
                <div className="text-[11px] text-slate-700 leading-relaxed space-y-3 font-serif">
                  <p>
                    This is to certify that the business enterprise operating under the legal name{' '}
                    <mark className="bg-amber-200/90 text-slate-900 px-1 py-0.5 rounded font-bold font-sans">
                      {doc.extractedData?.LegalName || doc.extractedData?.RegisteredName || currentBid.vendorName}
                    </mark>{' '}
                    has submitted official statutory documentation under public procurement compliance directives.
                  </p>

                  {/* Highlighted Evidence Callout Box */}
                  <div className="my-4 p-3 rounded-lg bg-emerald-50/90 border border-emerald-300 relative">
                    <div className="text-[10px] font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1 mb-1 font-sans">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>AI Extracted Evidence Match</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      {(doc.previewContent?.keyHighlights || []).map((h, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] font-sans">
                          <span className="text-slate-600">{h.label}:</span>
                          <span className={`font-bold font-mono ${h.isMatch ? 'text-emerald-900 bg-emerald-100/70 px-1 rounded' : 'text-red-700 bg-red-100/70 px-1 rounded'}`}>
                            {h.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic">
                    {doc.previewContent?.notes}
                  </p>
                </div>
              </div>

              {/* Document Signatures / Seal Footer */}
              <div className="pt-6 border-t border-slate-300 mt-8 flex items-end justify-between text-[10px]">
                <div>
                  <div className="font-mono text-slate-400">Digital Sign: SHA256-4b2a98f</div>
                  <div className="text-slate-500">Public Key: PKI-NIC-GOV-IND</div>
                </div>

                <div className="text-right">
                  <div className="w-24 border-b border-slate-400 mb-1"></div>
                  <div className="font-semibold text-slate-800">Authorized Signatory</div>
                  <div className="text-slate-500">Government Authority / CA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: AI Extracted Fields & Officer Verification */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Confidence & Status Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  AI OCR & Extraction Engine
                </span>
                <h3 className="text-sm font-bold text-slate-800">
                  Extracted Entities & Metadata
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800 font-mono">
                  {doc.aiConfidence}% Confidence
                </span>
                <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                  <div
                    className={`h-full ${doc.aiConfidence >= 90 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                    style={{ width: `${doc.aiConfidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Officer Action Bar: Verify, Flag, Edit */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => onToggleFlagStatus(doc.id, isFlagged ? 'Verified' : 'Flagged')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                  isFlagged
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                {isFlagged ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Clear Flag & Verify</span>
                  </>
                ) : (
                  <>
                    <Flag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Flag for Scrutiny</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (isEditing) {
                    handleSaveEdit();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                  isEditing
                    ? 'bg-[#0B5D3B] text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isEditing ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Edits</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Values</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Extracted Fields Table */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Extracted Fields ({Object.keys(editedFields).length})
              </h4>
              {isEditing && (
                <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                  Editing Mode Active
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {Object.entries(editedFields).map(([key, val]) => (
                <div
                  key={key}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1"
                >
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                    {key.replace(/_/g, ' ')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) =>
                        setEditedFields({
                          ...editedFields,
                          [key]: e.target.value,
                        })
                      }
                      className="text-xs p-1.5 bg-white border border-emerald-500 rounded font-medium text-slate-900 focus:outline-none"
                    />
                  ) : (
                    <div className="text-xs font-medium text-slate-900 font-mono select-all">
                      {val}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Procurement Officer Audit Notes */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-800" />
              <span>Officer Verification Remarks</span>
            </h4>

            <div className="space-y-2 mb-3">
              {notesList.map((n, idx) => (
                <div key={idx} className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {n}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                placeholder="Add verification note or query..."
                className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                onClick={handleAddNote}
                className="px-3 py-1.5 rounded-lg bg-[#0B5D3B] hover:bg-[#06452D] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
