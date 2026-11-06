import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, CheckCircle2, Clock, ShieldCheck, ArrowRight, Building, User, RefreshCw } from 'lucide-react';
import PageMeta from '../components/PageMeta';

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'professional' ? 'professional' : 'organization';
  
  const [activeTab, setActiveTab] = useState<'organization' | 'professional'>(initialType);

  // Sync tab with URL query parameter if it changes
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'professional' || type === 'organization') {
      setActiveTab(type);
    }
  }, [searchParams]);

  // Form states
  const [orgForm, setOrgForm] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    staffingNeed: 'Nursing Staffing (RN / LPN / CNA)',
    urgency: 'Immediate / Within 2 Weeks',
    message: '',
  });

  const [proForm, setProForm] = useState({
    name: '',
    email: '',
    phone: '',
    profession: 'Registered Nurse (RN)',
    experience: '3-5 years',
    location: '',
    message: '',
  });

  const [orgErrors, setOrgErrors] = useState<Record<string, string>>({});
  const [proErrors, setProErrors] = useState<Record<string, string>>({});

  const [orgSubmitted, setOrgSubmitted] = useState(false);
  const [proSubmitted, setProSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateOrg = () => {
    const errs: Record<string, string> = {};
    if (!orgForm.name.trim()) errs.name = 'Please provide contact name.';
    if (!orgForm.organization.trim()) errs.organization = 'Please provide organization name.';
    if (!orgForm.email.trim() || !/^\S+@\S+\.\S+$/.test(orgForm.email)) errs.email = 'Valid email is required.';
    if (!orgForm.phone.trim() || orgForm.phone.length < 10) errs.phone = 'Valid 10-digit phone number is required.';
    if (!orgForm.message.trim()) errs.message = 'Please specify staffing requirements.';
    setOrgErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePro = () => {
    const errs: Record<string, string> = {};
    if (!proForm.name.trim()) errs.name = 'Please provide your full name.';
    if (!proForm.email.trim() || !/^\S+@\S+\.\S+$/.test(proForm.email)) errs.email = 'Valid email is required.';
    if (!proForm.phone.trim() || proForm.phone.length < 10) errs.phone = 'Valid 10-digit phone number is required.';
    if (!proForm.location.trim()) errs.location = 'Please state your city/state or target location.';
    setProErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOrg()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/staffing-requests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_name: orgForm.organization,
          contact_name: orgForm.name,
          email: orgForm.email,
          phone: orgForm.phone,
          facility_type: 'Hospital / Healthcare Organization',
          staffing_type: orgForm.staffingNeed,
          roles_needed: orgForm.staffingNeed,
          urgency: orgForm.urgency,
          details: orgForm.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit staffing request');
      setOrgSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Unable to submit request right now. Please call +1 (800) 555-0199 or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePro()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: proForm.name,
          email: proForm.email,
          phone: proForm.phone,
          inquiry_type: 'Healthcare Professional Inquiry',
          subject: `Talent Inquiry - ${proForm.profession}`,
          message: `Profession: ${proForm.profession}\nExperience: ${proForm.experience}\nLocation / License: ${proForm.location}\nCareer Goals: ${proForm.message || 'General placement inquiry'}`,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit inquiry');
      setProSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Unable to submit inquiry right now. Please call +1 (800) 555-0199 or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7FAFC]">
      <PageMeta
        title="Contact Valora Healthcare – Staffing Inquiries & Candidate Support"
        description="Connect with Valora Healthcare. Specialized staffing request pathways for healthcare organizations and career inquiries for medical professionals."
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/60 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F5F2] border border-[#19A6A0]/20 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
              <span className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                Connect with Our Founding Team
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#16324F] leading-tight">
              Let's Start a Conversation.
            </h1>
            <p className="text-lg text-[#526273] leading-relaxed">
              As we launch Valora Healthcare, our leadership team is ready to connect directly. Whether you represent a healthcare organization exploring a more responsive staffing partner or are a clinician joining our inaugural roster, we welcome you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Details & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-[#16324F]">
                Direct Contact Information
              </h2>
              
              <div className="space-y-5 text-sm text-[#526273]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Toll-Free & Dispatch
                    </span>
                    <a href="tel:18005550199" className="text-base font-semibold text-[#16324F] hover:text-[#087F8C]">
                      +1 (800) 555-0199
                    </a>
                    <span className="block text-xs text-slate-500 mt-0.5">24/7 Clinical Emergency Line Available</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      General & Placement Inquiries
                    </span>
                    <a href="mailto:admin@valorahealthcare.com" className="text-base font-semibold text-[#16324F] hover:text-[#087F8C]">
                      admin@valorahealthcare.com
                    </a>
                    <span className="block text-xs text-slate-500 mt-0.5">Direct coordinator response within 4 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Recruitment Office Hours
                    </span>
                    <span className="text-base font-semibold text-[#16324F] block">
                      Mon – Fri: 8:00 AM – 6:00 PM EST
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">Active shift support operates 24/7/365</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Geographic Reach
                    </span>
                    <span className="text-base font-semibold text-[#16324F] block">
                      Nationwide Healthcare Network
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">Serving medical systems across the United States</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Credentialing badge card */}
            <div className="bg-[#DDF2F0]/50 rounded-3xl p-7 border border-[#087F8C]/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#087F8C] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Quality Standard</span>
              </div>
              <h3 className="text-base font-bold text-[#16324F]">
                Committed to Patient Safety
              </h3>
              <p className="text-xs text-[#526273] leading-relaxed">
                All clinicians are strictly primary-source credentialed in accordance with Joint Commission quality criteria prior to shift deployment.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Two-Path Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
              
              {/* Interactive Segmented Tabs - functional buttons per skill */}
              <div className="p-1 bg-[#F7FAFC] rounded-xl border border-slate-200 flex">
                <button
                  type="button"
                  onClick={() => setActiveTab('organization')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === 'organization'
                      ? 'bg-white text-[#087F8C] shadow-xs'
                      : 'text-[#526273] hover:text-[#16324F]'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Healthcare Organizations</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('professional')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === 'professional'
                      ? 'bg-white text-[#087F8C] shadow-xs'
                      : 'text-[#526273] hover:text-[#16324F]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Healthcare Professionals</span>
                </button>
              </div>

              {/* Path 1: Healthcare Organizations */}
              {activeTab === 'organization' && (
                <div>
                  {orgSubmitted ? (
                    <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-16 h-16 rounded-2xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#16324F]">Staffing Request Received</h3>
                      <p className="text-sm text-[#526273] max-w-md mx-auto">
                        Thank you for contacting Valora Healthcare. A senior clinical staffing director has received your request and will contact you promptly to discuss your requirements.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setOrgSubmitted(false);
                          setOrgForm({
                            name: '',
                            organization: '',
                            email: '',
                            phone: '',
                            staffingNeed: 'Nursing Staffing (RN / LPN / CNA)',
                            urgency: 'Immediate / Within 2 Weeks',
                            message: '',
                          });
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#16324F] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Submit Another Request</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleOrgSubmit} className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-base font-bold text-[#16324F]">
                          Healthcare Organization Staffing Inquiry
                        </h3>
                        <p className="text-xs text-[#526273]">
                          Fill in your facility details to receive customized clinical staffing support.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Contact Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Dr. Thomas Lee"
                            value={orgForm.name}
                            onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                              orgErrors.name ? 'border-red-400' : 'border-slate-300'
                            }`}
                          />
                          {orgErrors.name && <p className="text-[11px] text-red-500 mt-0.5">{orgErrors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Healthcare Organization / Facility <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. St. Jude Regional Hospital"
                            value={orgForm.organization}
                            onChange={(e) => setOrgForm({ ...orgForm, organization: e.target.value })}
                            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                              orgErrors.organization ? 'border-red-400' : 'border-slate-300'
                            }`}
                          />
                          {orgErrors.organization && <p className="text-[11px] text-red-500 mt-0.5">{orgErrors.organization}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Official Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="t.lee@hospital.org"
                            value={orgForm.email}
                            onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
                            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                              orgErrors.email ? 'border-red-400' : 'border-slate-300'
                            }`}
                          />
                          {orgErrors.email && <p className="text-[11px] text-red-500 mt-0.5">{orgErrors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            placeholder="(555) 019-2834"
                            value={orgForm.phone}
                            onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
                            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                              orgErrors.phone ? 'border-red-400' : 'border-slate-300'
                            }`}
                          />
                          {orgErrors.phone && <p className="text-[11px] text-red-500 mt-0.5">{orgErrors.phone}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Staffing Service Required
                          </label>
                          <select
                            value={orgForm.staffingNeed}
                            onChange={(e) => setOrgForm({ ...orgForm, staffingNeed: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900"
                          >
                            <option>Nursing Staffing (RN / LPN / CNA)</option>
                            <option>Allied Health (Therapy / Lab / Imaging)</option>
                            <option>Permanent Placement / Leadership</option>
                            <option>Rapid Response / Per Diem Surge</option>
                            <option>Comprehensive Workforce Advisory</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Deployment Timeline
                          </label>
                          <select
                            value={orgForm.urgency}
                            onChange={(e) => setOrgForm({ ...orgForm, urgency: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900"
                          >
                            <option>Immediate / Within 2 Weeks</option>
                            <option>Upcoming Month</option>
                            <option>Future Census Planning / Seasonal</option>
                            <option>Ongoing Per Diem Pool</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#16324F] mb-1">
                          Staffing Requirements & Department Details <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Please outline the number of clinical roles, unit specializations (e.g. ICU, ED, Med-Surg), shift schedules, and any specific EHR experience required..."
                          value={orgForm.message}
                          onChange={(e) => setOrgForm({ ...orgForm, message: e.target.value })}
                          className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                            orgErrors.message ? 'border-red-400' : 'border-slate-300'
                          }`}
                        />
                        {orgErrors.message && <p className="text-[11px] text-red-500 mt-0.5">{orgErrors.message}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
                      >
                        {isSubmitting ? (
                          <span>Sending Request...</span>
                        ) : (
                          <>
                            <span>Submit Staffing Request</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Path 2: Healthcare Professionals */}
              {activeTab === 'professional' && (
                <div>
                  {proSubmitted ? (
                    <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-16 h-16 rounded-2xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#16324F]">Inquiry Sent Successfully</h3>
                      <p className="text-sm text-[#526273] max-w-md mx-auto">
                        Thank you for reaching out, {proForm.name.split(' ')[0]}. A Valora recruitment specialist will review your details and reach out to discuss compatible opportunities.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setProSubmitted(false);
                          setProForm({
                            name: '',
                            email: '',
                            phone: '',
                            profession: 'Registered Nurse (RN)',
                            experience: '3-5 years',
                            location: '',
                            message: '',
                          });
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#16324F] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Send Another Message</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleProSubmit} className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-base font-bold text-[#16324F]">
                          Healthcare Professional Career Inquiry
                        </h3>
                        <p className="text-xs text-[#526273]">
                          Speak directly with our recruiter about shift options and career openings.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Maria Gonzalez, RN"
                            value={proForm.name}
                            onChange={(e) => setProForm({ ...proForm, name: e.target.value })}
                            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                              proErrors.name ? 'border-red-400' : 'border-slate-300'
                            }`}
                          />
                          {proErrors.name && <p className="text-[11px] text-red-500 mt-0.5">{proErrors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="maria.g@example.com"
                            value={proForm.email}
                            onChange={(e) => setProForm({ ...proForm, email: e.target.value })}
                            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                              proErrors.email ? 'border-red-400' : 'border-slate-300'
                            }`}
                          />
                          {proErrors.email && <p className="text-[11px] text-red-500 mt-0.5">{proErrors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            placeholder="(555) 012-7890"
                            value={proForm.phone}
                            onChange={(e) => setProForm({ ...proForm, phone: e.target.value })}
                            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                              proErrors.phone ? 'border-red-400' : 'border-slate-300'
                            }`}
                          />
                          {proErrors.phone && <p className="text-[11px] text-red-500 mt-0.5">{proErrors.phone}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Location / State License <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Texas (Compact eNLC)"
                            value={proForm.location}
                            onChange={(e) => setProForm({ ...proForm, location: e.target.value })}
                            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                              proErrors.location ? 'border-red-400' : 'border-slate-300'
                            }`}
                          />
                          {proErrors.location && <p className="text-[11px] text-red-500 mt-0.5">{proErrors.location}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Profession
                          </label>
                          <select
                            value={proForm.profession}
                            onChange={(e) => setProForm({ ...proForm, profession: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900"
                          >
                            <option>Registered Nurse (RN)</option>
                            <option>Licensed Practical Nurse (LPN / LVN)</option>
                            <option>Certified Nursing Assistant (CNA)</option>
                            <option>Physical / Occupational Therapist</option>
                            <option>Respiratory Therapist (RRT/CRT)</option>
                            <option>Radiology / Imaging Technologist</option>
                            <option>Medical Laboratory Technologist</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#16324F] mb-1">
                            Clinical Experience
                          </label>
                          <select
                            value={proForm.experience}
                            onChange={(e) => setProForm({ ...proForm, experience: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900"
                          >
                            <option>Under 1 year</option>
                            <option>1-2 years</option>
                            <option>3-5 years</option>
                            <option>6-10 years</option>
                            <option>10+ years</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#16324F] mb-1">
                          How can we support your career?
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Tell us about your ideal shifts, preferred hospital systems, or any questions you have regarding licensing and compensation..."
                          value={proForm.message}
                          onChange={(e) => setProForm({ ...proForm, message: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
                      >
                        {isSubmitting ? (
                          <span>Connecting with Recruiter...</span>
                        ) : (
                          <>
                            <span>Send Career Inquiry</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
