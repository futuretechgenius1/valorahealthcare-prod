import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Stethoscope, Clock, Award, Users, HeartPulse, Building2 } from 'lucide-react';
import PageMeta from '../components/PageMeta';
import nursingImg from '../assets/images/nursing_clinical_specialist_1793939460288.jpg';
import doctorPatientImg from '../assets/images/doctor_patient_care_1793940438071.jpg';

export default function NursingStaffingPage() {
  const nursingRoles = [
    {
      role: 'Registered Nurses (RNs)',
      desc: 'Highly trained professionals for acute care, intensive care units (ICU), emergency departments (ED), medical-surgical units, telemetry, operating rooms (OR), and post-anesthesia care units (PACU).',
      badges: ['ICU / CCU', 'Emergency Room', 'Med-Surg', 'Telemetry', 'OR / Perioperative'],
      bg: 'from-[#E7F5F2] to-white',
    },
    {
      role: 'Licensed Practical Nurses (LPNs) & LVNs',
      desc: 'Skilled clinical nurses providing medication administration, vital signs tracking, wound care, and dependable clinical coordination across sub-acute and long-term care facilities.',
      badges: ['Sub-Acute Care', 'Long-Term Care', 'Rehab Units', 'Medication Management'],
      bg: 'from-[#EAF2F8] to-white',
    },
    {
      role: 'Certified Nursing Assistants (CNAs)',
      desc: 'Dedicated patient care caregivers assisting with activities of daily living (ADLs), patient hygiene, mobility support, and empathetic bedside monitoring.',
      badges: ['Bedside Care', 'Patient Mobility', 'Vital Monitoring', 'Compassionate Assistance'],
      bg: 'from-[#E7F5F2] to-white',
    },
    {
      role: 'Specialized Nursing Support Professionals',
      desc: 'Surgical scrub technicians, telemetry monitoring technicians, and clinical care coordinators supporting integrated nursing workflows.',
      badges: ['Surgical Techs', 'Telemetry Techs', 'Clinical Coordinators'],
      bg: 'from-[#EAF2F8] to-white',
    },
  ];

  const employerBenefits = [
    {
      icon: Clock,
      title: 'Rapid Shift Turnaround',
      desc: 'Minimize costly empty shifts with pre-screened nurses available for immediate per diem or fast-turn contract starts.',
    },
    {
      icon: ShieldCheck,
      title: '100% Primary-Source Credentialed',
      desc: 'Direct state board license verification, background checks, drug screenings, OIG/GSA exclusion checks, and BLS/ACLS validation.',
    },
    {
      icon: Award,
      title: 'Clinical Unit Competency',
      desc: 'Nurses matched specifically based on clinical floor experience and Electronic Health Record (EHR) system familiarity (Epic, Cerner, Meditech).',
    },
    {
      icon: Users,
      title: 'Reduced Overtime & Burnout',
      desc: 'Protect your permanent staff from exhaustion and turnover by smoothing out census peaks with reliable Valora nurse professionals.',
    },
  ];

  return (
    <div className="bg-[#F7FAFC]">
      <PageMeta
        title="Nursing Staffing Solutions – RNs, LPNs, CNAs"
        description="Comprehensive nursing recruitment solutions delivering vetted Registered Nurses, Licensed Practical Nurses, and CNAs to leading healthcare organizations."
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-white via-[#EAF2F8]/30 to-[#F7FAFC] border-b border-slate-200/60 py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F5F2] border border-[#19A6A0]/20">
                <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
                <span className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                  Specialized Clinical Staffing
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#16324F] leading-tight">
                Nursing Staffing Delivering Clinical Excellence and Compassion.
              </h1>

              <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
                We connect hospitals, acute facilities, and care centers with dedicated Registered Nurses, LPNs, and CNAs who integrate smoothly and uphold unyielding patient safety.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/contact?type=organization"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
                >
                  <span>Request Nursing Staff</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/careers"
                  className="px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
                >
                  Nursing Careers Registration
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-100">
                <img
                  src={nursingImg}
                  alt="Registered nurse monitoring clinical telemetry data"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block absolute -bottom-5 -left-5 bg-[#16324F] text-white p-4 rounded-2xl shadow-xl max-w-xs border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#087F8C] flex items-center justify-center text-white shrink-0">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Compassionate Bedside</div>
                    <div className="text-[11px] text-slate-300">Acute care & specialty units</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ROLES BREAKDOWN */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087F8C] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
            <span>Nursing Disciplines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Comprehensive Nursing Roles We Place
          </h2>
          <p className="text-base text-[#526273]">
            Every nursing professional in our network is thoroughly vetted, verified, and ready to meet the specialized demands of your unit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nursingRoles.map((item) => (
            <div
              key={item.role}
              className={`bg-gradient-to-b ${item.bg} p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#087F8C] flex items-center justify-center text-white shadow-xs">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#16324F]">{item.role}</h3>
              </div>
              <p className="text-sm text-[#526273] leading-relaxed">
                {item.desc}
              </p>
              <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#087F8C] font-semibold">
                {item.badges.map((b, idx) => (
                  <span key={b}>
                    {b} {idx < item.badges.length - 1 ? '·' : ''}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EMPLOYER BENEFITS (Dark Navy Contrast Section) */}
      <section className="py-20 lg:py-24 bg-[#16324F] text-white border-y border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#19A6A0] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#19A6A0]" />
              <span>Partner Advantages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Facilities Choose Valora for Nursing Staffing
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              A recruitment infrastructure designed around clinical safety, regulatory compliance, and administrative ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {employerBenefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="p-7 rounded-3xl border border-white/10 bg-white/5 space-y-3 hover:border-[#19A6A0]/40 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 border border-[#19A6A0]/30 flex items-center justify-center text-[#19A6A0]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5-POINT NURSE CREDENTIALING STANDARD */}
      <section className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087F8C] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
              <span>Compliance & Credentialing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
              Rigorous 5-Point Nurse Credentialing Standard
            </h2>
            <p className="text-base text-[#526273]">
              We never cut corners on compliance. Every nurse who represents Valora Healthcare undergoes exhaustive verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-[#F7FAFC] p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-[#087F8C] font-mono">01</span>
              <h4 className="text-sm font-bold text-[#16324F]">License Verification</h4>
              <p className="text-xs text-[#526273]">Direct primary-source validation via state licensing boards with zero active disciplinary actions.</p>
            </div>
            <div className="bg-[#F7FAFC] p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-[#087F8C] font-mono">02</span>
              <h4 className="text-sm font-bold text-[#16324F]">Clinical Competency</h4>
              <p className="text-xs text-[#526273]">Standardized specialty exams, pharmacology assessments, and direct supervisor reference audits.</p>
            </div>
            <div className="bg-[#F7FAFC] p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-[#087F8C] font-mono">03</span>
              <h4 className="text-sm font-bold text-[#16324F]">Certifications (AHA)</h4>
              <p className="text-xs text-[#526273]">Active BLS, ACLS, PALS, NRP, and specialty certifications verified directly with issuing organizations.</p>
            </div>
            <div className="bg-[#F7FAFC] p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-[#087F8C] font-mono">04</span>
              <h4 className="text-sm font-bold text-[#16324F]">Health Screenings</h4>
              <p className="text-xs text-[#526273]">10-panel drug screens, TB clearance, immunization titers (Hep B, MMR, Varicella), and annual physicals.</p>
            </div>
            <div className="bg-[#F7FAFC] p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-[#087F8C] font-mono">05</span>
              <h4 className="text-sm font-bold text-[#16324F]">Background Audits</h4>
              <p className="text-xs text-[#526273]">Nationwide criminal background investigation, OIG, SAM/GSA exclusion list, and sex offender registry checks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRY CTA */}
      <section className="py-20 bg-gradient-to-br from-[#E7F5F2] via-[#EAF2F8] to-[#DDF2F0]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Need Qualified Nurses for Your Organization?
          </h2>
          <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
            Our clinical staffing coordinators are standing by to review your shift requirements, department specialties, and deployment timelines.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=organization"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
            >
              <span>Submit Nursing Staffing Request</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:18005550199"
              className="px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
            >
              Call Clinical Dispatch: +1 (800) 555-0199
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
