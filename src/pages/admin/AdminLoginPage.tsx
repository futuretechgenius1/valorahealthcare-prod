import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const { logoUrl, siteName } = useSiteSettings();

  const [email, setEmail] = useState('admin@valorahealthcare.com');
  const [password, setPassword] = useState('ValoraAdmin2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Badge */}
        {logoUrl ? (
          <div className="flex justify-center mb-4">
            <img
              src={logoUrl}
              alt={siteName || 'Valora Healthcare'}
              className="h-14 max-h-16 w-auto object-contain drop-shadow-sm"
            />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#087F8C] to-[#19A6A0] text-white font-extrabold text-2xl shadow-lg shadow-[#087F8C]/30 mb-4">
            V
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16324F] tracking-tight">
          Valora Admin Portal
        </h2>
        <p className="mt-2 text-sm text-[#526273]">
          Empowering People. Exceptional Care. Administrative Operations.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-100">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
              <AlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@valorahealthcare.com"
                  className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#087F8C] to-[#19A6A0] hover:from-[#076E7A] hover:to-[#168E89] shadow-lg shadow-[#087F8C]/25 transition duration-200 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Credential Helper */}
          <div className="mt-6 pt-6 border-t border-slate-100 bg-[#F7FAFC] -mx-6 sm:-mx-10 -mb-8 p-5 rounded-b-3xl">
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-[#087F8C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#16324F]">Default Super Admin Credentials</p>
                <div className="mt-1 space-y-0.5 text-[11px] text-slate-600 font-mono">
                  <p>Email: <span className="font-semibold text-slate-800">admin@valorahealthcare.com</span></p>
                  <p>Password: <span className="font-semibold text-slate-800">ValoraAdmin2026!</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs font-medium text-slate-500 hover:text-[#087F8C] transition"
          >
            ← Back to Valora Healthcare Public Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
