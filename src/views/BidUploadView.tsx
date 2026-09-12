import React, { useState } from 'react';
import {
  Upload,
  FileCheck,
  Sparkles,
  AlertCircle,
  CheckCircle,
  FileText,
  Trash2,
  Eye,
  Loader2,
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import { Tender, VendorBid, VendorDocument } from '../types';

interface BidUploadViewProps {
  currentTender: Tender;
  currentBid: VendorBid;
  tenders: Tender[];
  bids: VendorBid[];
  onSelectTender: (tender: Tender) => void;
  onSelectBid: (bid: VendorBid) => void;
  onViewDocDetails: (doc: VendorDocument) => void;
  onRunAiPipeline: () => void;
  onLoadDemoDocuments: () => void;
}

export const BidUploadView: React.FC<BidUploadViewProps> = ({
  currentTender,
  currentBid,
  tenders,
  bids,
  onSelectTender,
  onSelectBid,
  onViewDocDetails,
  onRunAiPipeline,
  onLoadDemoDocuments,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('GST Certificate');
  const [dragOver, setDragOver] = useState(false);

  const documentCategories = [
    'GST Certificate',
    'PAN',
    'Udyam/MSME Certificate',
    'Income Tax documents',
    'MCA/company documents',
    'Balance Sheet',
    'Financial Statements',
    'OEM Authorization',
    'Experience Certificates',
    'Technical Compliance Documents',
    'Make in India declaration',
    'EPFO/ESIC documents',
    'Startup/NSIC certificates',
    'Other supporting documents',
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      alert(`Received file "${e.dataTransfer.files[0].name}". In this prototype, demo package is preloaded and ready for verification.`);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      alert(`Uploaded "${e.target.files[0].name}" under category: ${selectedCategory}. Document queued for AI OCR pipeline.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Context Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Bid Document Ingestion
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {currentBid.documents.length} Submitted Documents
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload vendor schedules or load official bid packages for multi-category AI extraction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onLoadDemoDocuments}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#06452D] border border-emerald-300 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FolderOpen className="w-4 h-4 text-emerald-700" />
            <span>Load Demo Bid Package (ABC Eng.)</span>
          </button>

          <button
            onClick={onRunAiPipeline}
            className="px-4 py-2 rounded-xl bg-[#0B5D3B] hover:bg-[#06452D] text-white font-semibold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Run AI Extraction Pipeline</span>
          </button>
        </div>
      </div>

      {/* Tender and Bidder Context Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#F4F9F5] p-4 rounded-xl border border-emerald-900/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider">
              Evaluating Against Tender
            </div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {currentTender.tenderId} — {currentTender.title}
            </div>
            <div className="text-[11px] text-slate-500">
              Department: {currentTender.department}
            </div>
          </div>
          <select
            value={currentTender.id}
            onChange={(e) => {
              const t = tenders.find((x) => x.id === e.target.value);
              if (t) onSelectTender(t);
            }}
            className="text-xs bg-white border border-slate-300 rounded px-2 py-1 cursor-pointer"
          >
            {tenders.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tenderId}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[#F4F9F5] p-4 rounded-xl border border-emerald-900/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider">
              Vendor Under Evaluation
            </div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {currentBid.vendorName}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              GSTIN: {currentBid.gstin} • State: {currentBid.state}
            </div>
          </div>
          <select
            value={currentBid.id}
            onChange={(e) => {
              const b = bids.find((x) => x.id === e.target.value);
              if (b) onSelectBid(b);
            }}
            className="text-xs bg-white border border-slate-300 rounded px-2 py-1 cursor-pointer"
          >
            {bids.map((b) => (
              <option key={b.id} value={b.id}>
                {b.vendorName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Zone & Category Picker */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Select Mandatory Document Category
            </h3>
            <p className="text-xs text-slate-500">
              Tag uploaded documents with required GeM schedule categories
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Supported Formats: PDF, DOCX, XLSX, JPG, PNG (Max 50MB)
          </div>
        </div>

        {/* 14 Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {documentCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const hasUploadedDoc = currentBid.documents.some((d) => d.category === cat);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B5D3B] text-white border-emerald-800 shadow-xs'
                    : hasUploadedDoc
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {hasUploadedDoc && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver
              ? 'border-emerald-600 bg-emerald-50/50'
              : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6 text-[#0B5D3B]" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            Drag and drop {selectedCategory} here, or browse local files
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Automatic OCR, UDIN lookup, and cross-document validation will execute upon ingestion
          </p>

          <label className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs cursor-pointer shadow-xs">
            <span>Browse Files</span>
            <input
              type="file"
              accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Uploaded Files Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Uploaded Bid Documents ({currentBid.documents.length})
            </h3>
            <p className="text-xs text-slate-500">
              Real-time OCR confidence scores and verified metadata extractions
            </p>
          </div>
          <button
            onClick={onRunAiPipeline}
            className="text-xs text-[#0B5D3B] hover:text-[#06452D] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Trigger Full Re-Extraction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Document Name</th>
                <th className="py-3 px-4 font-semibold">Category Type</th>
                <th className="py-3 px-4 font-semibold">File Details</th>
                <th className="py-3 px-4 font-semibold">Upload Status</th>
                <th className="py-3 px-4 font-semibold">AI Extraction</th>
                <th className="py-3 px-4 font-semibold">Verification Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentBid.documents.map((doc) => {
                const isFlagged = doc.verificationStatus === 'Flagged';
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-800 shrink-0" />
                        <span>{doc.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Uploaded: {doc.uploadedAt}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {doc.fileType} • {doc.size} ({doc.pageCount} pgs)
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{doc.uploadStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              doc.aiConfidence >= 90 ? 'bg-emerald-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${doc.aiConfidence}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-800">
                          {doc.aiConfidence}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {Object.keys(doc.extractedData).length} entities parsed
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          isFlagged
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {isFlagged ? (
                          <>
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Flagged</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewDocDetails(doc)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#0B5D3B] text-[#06452D] hover:text-white font-semibold text-xs border border-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Evidence</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
