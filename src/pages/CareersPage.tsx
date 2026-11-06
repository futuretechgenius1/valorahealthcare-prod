import { useState } from 'react';
import { Upload, CheckCircle2, Shield, HeartHandshake, Award, FileText, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import PageMeta from '../components/PageMeta';
import careersImg from '../assets/images/careers_medical_professional_1793939460996.jpg';

export default function CareersPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: 'Registered Nurse (RN)',
    specialty: 'Medical-Surgical',
    yearsExperience: '3-5 years',
    workPreference: 'Travel / Contract',
    preferredLocation: '',
    notes: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState('');

  const professions = [
    'Registered Nurse (RN)',
    'Licensed Practical Nurse (LPN)',
    'Licensed Vocational Nurse (LVN)',
    'Certified Nursing Assistant (CNA)',
    'Physical Therapist (PT)',
    'Physical Therapy Assistant (PTA)',
    'Occupational Therapist (OT)',
    'Respiratory Therapist (RRT/CRT)',
    'Diagnostic Imaging / Radiologic Tech',
    'Medical Laboratory Scientist / Tech',
    'Nurse Practitioner / Advanced Practice',
    'Healthcare Leadership / Management',
    'Other Allied Health Specialty',
  ];

  const specialties = [
    'Medical-Surgical',
    'Intensive Care Unit (ICU / CCU)',
    'Emergency Department (ED)',
    'Telemetry',
    'Operating Room / Perioperative',
    'Post-Anesthesia Care (PACU)',
    'Labor & Delivery / Mother-Baby',
    'Pediatrics / NICU',
    'Inpatient Rehabilitation',
    'Outpatient Physical Therapy',
    'Long-Term Care / Skilled Nursing',
    'General Radiology / CT / MRI',
    'Clinical Chemistry / Lab Diagnostics',
    'Other Clinical Focus',
  ];

  const experienceOptions = [
    'Under 1 year (Graduate / Resident)',
    '1-2 years',
    '3-5 years',
    '6-10 years',
    '10+ years',
  ];

  const workPreferences = [
    'Travel / 13-Week Contract',
    'Per Diem / PRN Shifts',
    'Permanent Direct Placement',
    'Contract-to-Hire',
    'Flexible / Open to All Options',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full legal name.';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      errs.phone = 'Please provide a valid 10-digit phone number.';
    }
    if (!formData.preferredLocation.trim()) {
      errs.preferredLocation = 'Please specify your target state or city.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, resume: 'File exceeds 10MB limit. Please upload a smaller PDF or Word doc.' }));
      } else {
        setResumeFile(file);
        setErrors((prev) => {
          const rest = { ...prev };
          delete rest.resume;
          return rest;
        });
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, resume: 'File exceeds 10MB limit.' }));
      } else {
        setResumeFile(file);
        setErrors((prev) => {
          const rest = { ...prev };
          delete rest.resume;
          return rest;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const parts = formData.fullName.trim().split(' ');
      const firstName = parts[0] || 'Candidate';
      const lastName = parts.slice(1).join(' ') || 'Applicant';

      const data = new FormData();
      data.append('first_name', firstName);
      data.append('last_name', lastName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('profession', formData.profession);
      data.append('specialty', formData.specialty);
      data.append('experience_years', formData.yearsExperience);
      data.append('preferred_location', formData.preferredLocation);
      data.append('availability', formData.workPreference);
      data.append('notes', formData.notes);
      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      const res = await fetch('/api/candidates/register', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit candidate profile');

      setSubmitted(true);
      setRegId(`VAL-${result.id ? String(result.id).padStart(5, '0') : Math.floor(100000 + Math.random() * 900000)}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error submitting candidate registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      profession: 'Registered Nurse (RN)',
      specialty: 'Medical-Surgical',
      yearsExperience: '3-5 years',
      workPreference: 'Travel / Contract',
      preferredLocation: '',
      notes: '',
    });
    setResumeFile(null);
    setErrors({});
  };

  return (
    <div className="bg-[#F7FAFC]">
      <PageMeta
        title="Careers & Professional Candidate Registration"
        description="Your skills matter. Your future matters. Register with Valora Healthcare to explore top nursing and allied health career opportunities nationwide."
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-white via-[#EAF2F8]/30 to-[#F7FAFC] border-b border-slate-200/60 py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F5F2] border border-[#19A6A0]/20">
                <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
                <span className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                  Join Our Inaugural Clinical Roster
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#16324F] leading-tight">
                Your Skills Matter. Your Future Matters.
              </h1>
              <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
                Be part of our founding clinical community. As a newly launched healthcare staffing agency, we offer clinicians direct one-on-one attention from our leadership team, highly competitive compensation, and early access to top healthcare facility assignments.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-6 text-xs text-[#16324F] font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
                  <span>Founding Roster Pay Packages</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
                  <span>Direct Founder-Led Placement Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
                  <span>Comprehensive Credentialing Assistance</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-100">
                <img
                  src={careersImg}
                  alt="Compassionate healthcare professional nurse smiling in medical center lobby"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Join Valora Strip */}
      <section className="py-14 bg-[#E7F5F2]/50 border-b border-[#19A6A0]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#087F8C] shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#16324F]">Personal Career Advocacy</h3>
                <p className="text-xs text-[#526273] mt-1 leading-relaxed">
                  You are never just a headcount. As a founding clinician, our leadership directly advocates for your desired shift schedule, safety, and compensation goals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#087F8C] shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#16324F]">Safe & Supportive Facilities</h3>
                <p className="text-xs text-[#526273] mt-1 leading-relaxed">
                  We carefully select partner healthcare facilities that maintain safe nurse-to-patient ratios and supportive unit leadership.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#087F8C] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#16324F]">Tailored Career Paths</h3>
                <p className="text-xs text-[#526273] mt-1 leading-relaxed">
                  Whether you seek high-flexibility per diem shifts, 13-week contracts, or permanent clinical positions, we shape options around your life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Candidate Registration Form */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
          
          {submitted ? (
            <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold tracking-widest text-[#087F8C] uppercase">
                  Candidate Registration Received
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#16324F]">
                  Thank You, {formData.fullName.split(' ')[0]}!
                </h2>
                <p className="text-sm sm:text-base text-[#526273] max-w-lg mx-auto">
                  Your registration has been logged under candidate profile <span className="font-mono font-bold text-[#16324F]">{regId}</span>. A Valora clinical recruitment coordinator will review your background and contact you within 24 business hours.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F7FAFC] border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs text-[#526273]">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#16324F]">Profession:</span>
                  <span>{formData.profession}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#16324F]">Specialty:</span>
                  <span>{formData.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#16324F]">Work Model:</span>
                  <span>{formData.workPreference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#16324F]">Resume:</span>
                  <span>{resumeFile ? resumeFile.name : 'Not attached (provided upon interview)'}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#16324F] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Submit Another Registration</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2 border-b border-slate-100 pb-6">
                <div className="text-xs font-semibold tracking-widest text-[#087F8C] uppercase">
                  Candidate Portal
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#16324F]">
                  Professional Registration Form
                </h2>
                <p className="text-sm text-[#526273]">
                  Register your clinical credentials to be contacted by our talent acquisition team regarding upcoming facility openings matching your skills.
                </p>
              </div>

              {/* Personal Contact Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#16324F]">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#16324F] mb-1.5">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Jenkins, RN"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                        errors.fullName ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                    {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#16324F] mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="sarah.jenkins@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                        errors.email ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#16324F] mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="(555) 012-3456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                        errors.phone ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Clinical Background */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#16324F]">
                  2. Clinical Specialty & Experience
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#16324F] mb-1.5">
                      Primary Profession <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900"
                    >
                      {professions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#16324F] mb-1.5">
                      Clinical Specialty Focus <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900"
                    >
                      {specialties.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#16324F] mb-1.5">
                      Years of Clinical Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900"
                    >
                      {experienceOptions.map((exp) => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#16324F] mb-1.5">
                      Preferred Work Model <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.workPreference}
                      onChange={(e) => setFormData({ ...formData, workPreference: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900"
                    >
                      {workPreferences.map((wp) => (
                        <option key={wp} value={wp}>{wp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16324F] mb-1.5">
                    Location Preference (City / State / Compact License States) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Florida / Georgia, or eNLC Multistate License"
                    value={formData.preferredLocation}
                    onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900 ${
                      errors.preferredLocation ? 'border-red-400' : 'border-slate-300'
                    }`}
                  />
                  {errors.preferredLocation && <p className="text-[11px] text-red-500 mt-1">{errors.preferredLocation}</p>}
                </div>
              </div>

              {/* Resume Upload */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#16324F]">
                  3. Resume / Curriculum Vitae (Optional)
                </h3>
                
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${
                    dragOver ? 'border-[#087F8C] bg-[#DDF2F0]/30' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                  onClick={() => document.getElementById('resume-file-input')?.click()}
                >
                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-3 text-sm text-[#16324F]">
                      <FileText className="w-6 h-6 text-[#087F8C]" />
                      <div className="text-left">
                        <div className="font-semibold">{resumeFile.name}</div>
                        <div className="text-xs text-slate-500">{(resumeFile.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                        }}
                        className="ml-3 text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs font-semibold text-[#16324F]">
                        Click to upload or drag and drop your resume
                      </div>
                      <div className="text-[11px] text-slate-500">
                        PDF, DOCX, or DOC (Max file size: 10MB)
                      </div>
                    </div>
                  )}
                </div>
                {errors.resume && <p className="text-xs text-red-500">{errors.resume}</p>}
              </div>

              {/* Notes */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-[#16324F]">
                  Additional Notes or Specific Shift Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Seeking night shift ICU contracts or weekend PRN availability starting next month..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-900"
                />
              </div>

              {/* Privacy Notice */}
              <p className="text-xs text-slate-500 leading-relaxed">
                By submitting this registration, you authorize Valora Healthcare to contact you regarding relevant clinical opportunities. Your data is managed strictly in accordance with our Privacy Policy.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
              >
                {isSubmitting ? (
                  <span>Registering Candidate Profile...</span>
                ) : (
                  <>
                    <span>Submit Candidate Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </section>

    </div>
  );
}
