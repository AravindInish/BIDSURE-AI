import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  X, 
  FileText, 
  Brain, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

interface AiPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  onComplete: () => void;
}

export const AiPipelineModal: React.FC<AiPipelineModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  onComplete,
}) => {
  const steps = [
    { id: 1, label: 'Document Received & Ingested', detail: '7 statutory files validated against GeM format security rules' },
    { id: 2, label: 'OCR & Text Extraction', detail: 'Tesseract/Multilingual OCR scanned text from balance sheets & certificates' },
    { id: 3, label: 'Information Extraction', detail: 'Extracted GSTIN, PAN, UDIN, turnover figures & date validities' },
    { id: 4, label: 'Entity Identification & Cross-Doc Check', detail: 'Compared vendor name variations between MCA, GST and Udyam' },
    { id: 5, label: 'Requirement Clause Matching', detail: 'Evaluated bid schedules against 22 clauses in RFP CPCL-IEP-2026-088' },
    { id: 6, label: 'Compliance Verification', detail: 'Computed weighted scores across Eligibility, Tech, & Experience' },
    { id: 7, label: 'Risk Assessment & Anomaly Detection', detail: 'Generated risk score 32/100 (Flagged OEM warranty duration shortfall)' },
  ];

  const [activeStep, setActiveStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(1);
      setCompleted(false);
      return;
    }

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setCompleted(true);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#06452D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0B5D3B] flex items-center justify-center border border-emerald-400/40 text-amber-300">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif flex items-center gap-1.5">
                AI Compliance Extraction Pipeline
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded font-mono">
                  SIH26100
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200/80">
                Processing vendor submission for: <strong>{vendorName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 7-Step Progress List */}
        <div className="p-6 space-y-3.5 bg-[#F8FAF9]">
          {steps.map((s) => {
            const isDone = s.id < activeStep || completed;
            const isCurrent = s.id === activeStep && !completed;
            const isPending = s.id > activeStep;

            return (
              <div
                key={s.id}
                className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/40 shadow-xs'
                    : isDone
                    ? 'bg-white border-emerald-100 text-slate-800'
                    : 'bg-white/50 border-slate-100 text-slate-400'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B5D3B]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-mono">
                      {s.id}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={isCurrent ? 'text-emerald-950 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'}>
                      {s.id}. {s.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-mono animate-pulse">
                        Processing...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    {s.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completed Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            {completed ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Pipeline complete! Compliance Matrix refreshed.
              </span>
            ) : (
              <span>Executing automated verification pipeline...</span>
            )}
          </div>

          <button
            onClick={() => {
              onComplete();
              onClose();
            }}
            disabled={!completed}
            className="px-4 py-2 rounded-lg bg-[#0B5D3B] hover:bg-[#06452D] disabled:opacity-40 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
          >
            Review Compliance Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
