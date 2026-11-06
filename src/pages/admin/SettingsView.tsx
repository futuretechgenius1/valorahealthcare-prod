import React, { useState, useEffect, useRef } from 'react';
import { Settings, Save, CheckCircle2, Database, ShieldCheck, MessageSquare, Image, Upload, Trash2, RefreshCw, Eye } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const SettingsView: React.FC = () => {
  const { logoUrl, setLogoUrl, refreshSettings } = useSiteSettings();
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'Valora Healthcare',
    contact_email: 'admin@valorahealthcare.com',
    phone_number: '+1 (800) 555-0199',
    support_hours: '24/7 Clinical & Staffing Support',
    auto_chat_greeting: 'Welcome to Valora Healthcare! How can our clinical team help you today?',
    enable_chat: 'true',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoMsg, setLogoMsg] = useState<{ text: string; error: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await adminApi.getSettings();
        if (data && Object.keys(data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleLogoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await executeLogoUpload(file);
    }
  };

  const handleLogoDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await executeLogoUpload(file);
    }
  };

  const executeLogoUpload = async (file: File) => {
    setLogoUploading(true);
    setLogoMsg(null);
    try {
      const res = await adminApi.uploadLogo(file);
      setLogoUrl(res.logoUrl);
      setSettings((prev) => ({ ...prev, site_logo_url: res.logoUrl }));
      setLogoMsg({ text: 'Logo uploaded and updated immediately across all pages!', error: false });
      await refreshSettings();
    } catch (err: any) {
      setLogoMsg({ text: err.message || 'Failed to upload logo', error: true });
    } finally {
      setLogoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = async () => {
    if (!confirm('Revert to the default Valora Healthcare brand emblem?')) return;
    setLogoUploading(true);
    setLogoMsg(null);
    try {
      await adminApi.deleteLogo();
      setLogoUrl('');
      setSettings((prev) => ({ ...prev, site_logo_url: '' }));
      setLogoMsg({ text: 'Custom logo removed. Reverted to default brand mark.', error: false });
      await refreshSettings();
    } catch (err: any) {
      setLogoMsg({ text: err.message || 'Failed to remove custom logo', error: true });
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(false);
    try {
      await adminApi.updateSettings(settings);
      setSavedMsg(true);
      await refreshSettings();
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#16324F]">System & Operations Settings</h2>
          <p className="text-xs text-slate-500">
            Configure dynamic brand logo, global website parameters, and real-time live chat behaviors
          </p>
        </div>
      </div>

      {/* Brand Dynamic Logo Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center font-bold">
              <Image size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#16324F]">Dynamic Brand Logo</h3>
              <p className="text-xs text-slate-500">
                Upload your official company logo. Changes synchronize immediately across the Navbar, Footer, and Admin Portal.
              </p>
            </div>
          </div>
          {logoUrl && (
            <button
              onClick={handleRemoveLogo}
              disabled={logoUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
            >
              <Trash2 size={13} />
              <span>Reset to Default</span>
            </button>
          )}
        </div>

        {logoMsg && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
              logoMsg.error ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
            }`}
          >
            <CheckCircle2 size={16} className={logoMsg.error ? 'text-rose-600' : 'text-emerald-600'} />
            <span>{logoMsg.text}</span>
          </div>
        )}

        {/* Dual Context Previews (Light background & Dark background) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Context Preview (Website Header) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[140px] text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Preview on Light Background (Website Header)
            </span>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Brand Logo"
                className="max-h-12 w-auto object-contain drop-shadow-xs"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-[#087F8C] flex items-center justify-center text-white">
                  V
                </div>
                <span>Valora Healthcare (Default)</span>
              </div>
            )}
          </div>

          {/* Dark Context Preview (Admin Sidebar & Footer) */}
          <div className="bg-[#16324F] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[140px] text-center border border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 mb-2">
              Preview on Dark Background (Admin Sidebar & Footer)
            </span>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Brand Logo"
                className="max-h-12 w-auto object-contain brightness-105"
              />
            ) : (
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-[#087F8C] flex items-center justify-center text-white">
                  V
                </div>
                <span>Valora Healthcare (Default)</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleLogoDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#087F8C]/30 hover:border-[#087F8C] bg-[#DDF2F0]/20 hover:bg-[#DDF2F0]/40 rounded-2xl p-6 text-center cursor-pointer transition"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoFileSelect}
            accept=".png,.jpg,.jpeg,.svg,.webp"
            className="hidden"
          />
          {logoUploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="w-8 h-8 border-3 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin" />
              <p className="text-xs font-bold text-[#087F8C]">Uploading & broadcasting logo immediately...</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Upload className="w-8 h-8 text-[#087F8C] mx-auto mb-1" />
              <p className="text-xs font-bold text-[#16324F]">
                Click to browse or drag and drop your logo file
              </p>
              <p className="text-[11px] text-slate-500">
                Supports PNG, SVG, JPG, WebP with transparent background (Max 5MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Global Parameters Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        {savedMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>Settings successfully persisted to MySQL database!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Details */}
          <div>
            <h3 className="font-bold text-sm text-[#16324F] pb-3 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#087F8C]" />
              <span>Agency Brand & Contact Information</span>
            </h3>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={settings.site_name || ''}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Administrative Contact Email</label>
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Direct Support Hotline</label>
                <input
                  type="text"
                  value={settings.phone_number || ''}
                  onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Support Coverage</label>
                <input
                  type="text"
                  value={settings.support_hours || ''}
                  onChange={(e) => setSettings({ ...settings, support_hours: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Live Chat Configuration */}
          <div>
            <h3 className="font-bold text-sm text-[#16324F] pb-3 border-b border-slate-100 flex items-center gap-2">
              <MessageSquare size={16} className="text-[#087F8C]" />
              <span>Live Chat System Configuration</span>
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Automated Welcome Greeting</label>
                <textarea
                  rows={2}
                  value={settings.auto_chat_greeting || ''}
                  onChange={(e) => setSettings({ ...settings, auto_chat_greeting: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enable_chat"
                  checked={settings.enable_chat === 'true'}
                  onChange={(e) => setSettings({ ...settings, enable_chat: e.target.checked ? 'true' : 'false' })}
                  className="w-4 h-4 text-[#087F8C] rounded-md focus:ring-[#087F8C]"
                />
                <label htmlFor="enable_chat" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Enable Live Chat widget across public website
                </label>
              </div>
            </div>
          </div>

          {/* Database Connection Summary */}
          <div>
            <h3 className="font-bold text-sm text-[#16324F] pb-3 border-b border-slate-100 flex items-center gap-2">
              <Database size={16} className="text-[#087F8C]" />
              <span>Infrastructure Connectivity</span>
            </h3>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 font-mono text-slate-700">
              <p>MySQL Host: <span className="text-[#087F8C] font-semibold">srv1786.hstgr.io</span></p>
              <p>Database: <span className="text-[#087F8C] font-semibold">u106825176_valora</span></p>
              <p>Port: <span className="font-semibold">3306</span></p>
              <p>Status: <span className="text-emerald-700 font-semibold">● Active Production Connection</span></p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#087F8C] to-[#19A6A0] hover:from-[#076E7A] hover:to-[#168E89] rounded-xl shadow-md shadow-[#087F8C]/20 transition disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsView;
