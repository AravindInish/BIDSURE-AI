import React, { useState } from 'react';
import {
  Settings,
  Scale,
  Cpu,
  Shield,
  Save,
  CheckCircle,
  Bell,
  HardDrive,
  RefreshCcw,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [weights, setWeights] = useState({
    eligibility: 30,
    financial: 25,
    technical: 20,
    legal: 15,
    experience: 10,
  });

  const [minScoreThreshold, setMinScoreThreshold] = useState(75);
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [isSaved, setIsSaved] = useState(false);

  const totalWeight =
    weights.eligibility +
    weights.financial +
    weights.technical +
    weights.legal +
    weights.experience;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      alert(`Weights must total 100%. Current total: ${totalWeight}%`);
      return;
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Platform & Evaluation Settings
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              CVC & GFR-2017 Config
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure scoring weightages, AI OCR model thresholds, and statutory audit archiving.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Configuration Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Evaluation Pillar Weights */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#0B5D3B]" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Compliance Pillar Scoring Weights
              </h3>
            </div>
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                totalWeight === 100
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              Total: {totalWeight}% / 100%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Eligibility Criteria Weight (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.eligibility}
                onChange={(e) =>
                  setWeights({ ...weights, eligibility: parseInt(e.target.value) || 0 })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Financial Standing & Turnover Weight (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.financial}
                onChange={(e) =>
                  setWeights({ ...weights, financial: parseInt(e.target.value) || 0 })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Technical & OEM Specifications Weight (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.technical}
                onChange={(e) =>
                  setWeights({ ...weights, technical: parseInt(e.target.value) || 0 })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Legal & Statutory Registrations Weight (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.legal}
                onChange={(e) =>
                  setWeights({ ...weights, legal: parseInt(e.target.value) || 0 })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Past Experience Weight (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.experience}
                onChange={(e) =>
                  setWeights({ ...weights, experience: parseInt(e.target.value) || 0 })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Minimum Qualification Cutoff Score (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={minScoreThreshold}
                onChange={(e) => setMinScoreThreshold(parseInt(e.target.value) || 75)}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AI Engine Settings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-[#0B5D3B]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. AI Engine & Extraction Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Model Designation
              </label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Production Fast)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Auditing)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Flagging Confidence Threshold
              </label>
              <input
                type="text"
                disabled
                value="90% (Mandatory review for confidence < 90%)"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Statutory Retention & Security */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-[#0B5D3B]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Governance & Retention Policy
            </h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-800">Audit Trail Retention Window</span>
              <span className="font-mono text-emerald-800 font-bold">7 Years (Mandatory under GFR-2017)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-800">Hashing Standard</span>
              <span className="font-mono text-emerald-800 font-bold">SHA-256 + HMAC Authentication</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#06452D] text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
