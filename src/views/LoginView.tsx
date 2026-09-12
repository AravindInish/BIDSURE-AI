import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle, AlertCircle, Building2 } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('officer.cpcl@gem.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06452D] via-[#0B5D3B] to-[#04281A] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Subtle Watermark Graphics */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <ShieldCheck className="w-[800px] h-[800px] text-white" />
      </div>

      {/* Top Government Banner */}
      <div className="w-full max-w-md text-center mb-6 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-200 text-xs mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Government e-Marketplace (GeM) Verification Engine</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-serif tracking-tight flex items-center justify-center gap-2">
          <ShieldCheck className="w-8 h-8 text-emerald-300" />
          BidSure AI
        </h1>
        <p className="text-sm text-emerald-100/80 mt-1 font-medium">
          AI-Powered Bid Compliance & Verification Platform
        </p>
        <span className="inline-block mt-1 text-[11px] bg-emerald-900/80 text-emerald-300 px-2.5 py-0.5 rounded font-mono font-semibold border border-emerald-700/50">
          SIH 2026 | Problem Statement SIH26100
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-emerald-900/20 p-8 z-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Officer Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access authorized tender evaluation & AI compliance dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Email / GeM Officer ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.name@gem.gov.in"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password / Digital Token PIN
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('In this SIH prototype, click "Sign In to Dashboard" to test directly.');
                }}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-medium"
              >
                Forgot PIN?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>Remember this workstation</span>
            </label>
            <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
              2FA Active (DSC Token)
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#0B5D3B] hover:bg-[#06452D] text-white font-semibold text-xs tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span>Authenticating DSC Credentials...</span>
            ) : (
              <>
                <span>Sign In to GeM Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Trigger */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-2.5">
            SIH 2026 Evaluation Access
          </div>
          <button
            onClick={() => onLoginSuccess()}
            className="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#06452D] border border-emerald-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Instant Demo Access as Senior Procurement Officer</span>
          </button>
        </div>

        {/* Government Disclaimer */}
        <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600 flex items-start gap-2">
          <Building2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Secure Government Procurement Environment:</strong> Access restricted to authorized GeM buyers, technical evaluators, and PSU procurement committees.
          </p>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="mt-6 text-center text-xs text-emerald-200/60 z-10">
        Smart India Hackathon 2026 • Problem Statement SIH26100 • Prototype System
      </div>
    </div>
  );
};
