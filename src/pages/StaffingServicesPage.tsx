import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, Activity, UserCheck, Building2, CheckCircle2, Shield, Hospital, HeartPulse, Building, Home } from 'lucide-react';
import PageMeta from '../components/PageMeta';
import WorkflowJourney from '../components/WorkflowJourney';

// Images
import nursingThumb from '../assets/images/nursing_clinical_specialist_1793939460288.jpg';
import alliedThumb from '../assets/images/allied_health_therapy_1793939460829.jpg';
import execThumb from '../assets/images/clinical_executive_team_1793940437944.jpg';
import facilityThumb from '../assets/images/org_hospital_facility_1793940437996.jpg';

export default function StaffingServicesPage() {
  const industries = [
    {
      icon: Hospital,
      title: 'Acute Care Hospitals',
      desc: 'Level I-IV trauma centers, tertiary medical centers, and community hospitals requiring ICU, ED, and Med-Surg coverage.',
    },
    {
      icon: HeartPulse,
      title: 'Outpatient & Ambulatory Care',
      desc: 'Day surgery centers, urgent care clinics, and specialty medical practices needing reliable procedural and clinical staff.',
    },
    {
      icon: Building,
      title: 'Rehabilitation Facilities',
      desc: 'Inpatient and outpatient physical, occupational, and speech therapy clinics focused on restorative patient journeys.',
    },
    {
      icon: Home,
      title: 'Skilled Nursing & Long-Term Care',
      desc: 'Assisted living, memory care, and post-acute facilities requiring consistent, compassionate daily clinical caregivers.',
    },
  ];

  return (
    <div className="bg-[#F7FAFC]">
      <PageMeta
        title="Staffing Services – Healthcare Staffing Solutions Built Around Your Needs"
        description="Comprehensive healthcare staffing solutions including Nursing Staffing, Allied Health, Permanent Placement, and custom Workforce Solutions."
      />

      {/* SECTION 1: HERO */}
      <section className="bg-gradient-to-b from-white via-[#EAF2F8]/30 to-[#F7FAFC] border-b border-slate-200/60 py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F5F2] border border-[#19A6A0]/20">
              <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
              <span className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                Comprehensive Workforce Solutions
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#16324F] leading-tight">
              Healthcare Staffing Solutions Built Around Your Needs.
            </h1>
            
            <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
              From acute hospital floors to specialized outpatient centers, Valora Healthcare delivers customized clinical staffing models that stabilize operations and protect patient care standards.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/contact?type=organization"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
              >
                <span>Request Staffing Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#services-breakdown"
                className="px-6 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
              >
                Explore Specialized Disciplines
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTRODUCTION STRIP (Soft mint background with key metrics) */}
      <section className="py-16 bg-[#E7F5F2]/60 border-b border-[#19A6A0]/20">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16324F]">
            Meeting Clinical Demands with Speed, Rigor, and Empathy.
          </h2>
          <p className="text-base text-[#526273] leading-relaxed max-w-3xl mx-auto">
            Staffing shortages impact patient outcomes, increase overtime costs, and burn out existing staff. Valora Healthcare serves as an agile, reliable extension of your talent acquisition team—providing primary-source verified healthcare professionals who hit the ground running.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80">
              <span className="block text-2xl font-extrabold text-[#087F8C]">RN / LPN / CNA</span>
              <span className="text-xs text-[#526273]">Nursing Specialties</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80">
              <span className="block text-2xl font-extrabold text-[#16324F]">PT / OT / RT</span>
              <span className="text-xs text-[#526273]">Therapy & Diagnostics</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80">
              <span className="block text-2xl font-extrabold text-[#19A6A0]">Direct-Hire</span>
              <span className="text-xs text-[#526273]">Leadership Search</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80">
              <span className="block text-2xl font-extrabold text-[#087F8C]">Rapid PRN</span>
              <span className="text-xs text-[#526273]">Per Diem & Surge</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: NURSING STAFFING (Image-led Block) */}
      <section id="services-breakdown" className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#E7F5F2] text-[#087F8C] flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                Specialized Service 01
              </div>
              <h2 className="text-3xl font-extrabold text-[#16324F]">
                Nursing Staffing
              </h2>
              <p className="text-base text-[#526273] leading-relaxed">
                We supply highly skilled, compassionate nursing personnel across critical care, emergency departments, med-surg floors, operating rooms, and long-term care settings.
              </p>
              <ul className="space-y-2.5 text-sm text-[#526273]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0" />
                  <span>Registered Nurses (RNs) – ICU, ER, Telemetry, Med-Surg, OR</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0" />
                  <span>Licensed Practical Nurses (LPNs) & Licensed Vocational Nurses (LVNs)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0" />
                  <span>Certified Nursing Assistants (CNAs) & Patient Care Techs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0" />
                  <span>Per diem, contract, travel, and rapid response deployment</span>
                </li>
              </ul>
              <div>
                <Link
                  to="/nursing-staffing"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-xs transition-all"
                >
                  <span>Explore Nursing Staffing Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-slate-100">
                <img
                  src={nursingThumb}
                  alt="Registered nurse checking digital patient monitoring tablet"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: ALLIED HEALTH STAFFING (Alternating Soft Blue Background) */}
      <section className="py-20 bg-[#EAF2F8]/50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-slate-100">
                <img
                  src={alliedThumb}
                  alt="Physical therapist aiding patient mobility in rehabilitation clinic"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                Specialized Service 02
              </div>
              <h2 className="text-3xl font-extrabold text-[#16324F]">
                Allied Health Staffing
              </h2>
              <p className="text-base text-[#526273] leading-relaxed">
                Diagnostic, therapeutic, and technical healthcare professionals are essential to the continuum of care. We connect facilities with licensed allied specialists ready to contribute immediately.
              </p>
              <ul className="space-y-2.5 text-sm text-[#526273]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0" />
                  <span>Physical Therapists (PT) & PT Assistants (PTA)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0" />
                  <span>Occupational Therapists (OT) & OT Assistants (COTA)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0" />
                  <span>Respiratory Therapists (RRT / CRT) for acute ventilation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0" />
                  <span>Medical Laboratory Technologists & Diagnostic Imaging specialists</span>
                </li>
              </ul>
              <div>
                <Link
                  to="/allied-health-staffing"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-xs transition-all"
                >
                  <span>Explore Allied Health Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: PERMANENT PLACEMENT (Image-led Block) */}
      <section className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#E7F5F2] text-[#087F8C] flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                Specialized Service 03
              </div>
              <h2 className="text-3xl font-extrabold text-[#16324F]">
                Permanent Placement & Direct Hire
              </h2>
              <p className="text-base text-[#526273] leading-relaxed">
                When you need long-term stability and cultural alignment, our executive healthcare search team identifies, screens, and recruits permanent clinical providers and healthcare leaders who build enduring institutional value.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl border border-slate-200 bg-[#F7FAFC]">
                  <h4 className="text-sm font-bold text-[#16324F] mb-1">Clinical Leadership</h4>
                  <p className="text-xs text-[#526273]">Directors of Nursing, Nurse Managers, Chief Medical Officers, and Clinical Coordinators.</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200 bg-[#F7FAFC]">
                  <h4 className="text-sm font-bold text-[#16324F] mb-1">Direct-Hire Clinical Staff</h4>
                  <p className="text-xs text-[#526273]">Specialized staff nurses and clinical practitioners seeking career homes.</p>
                </div>
              </div>
              <div>
                <Link
                  to="/permanent-placement"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-xs transition-all"
                >
                  <span>Explore Permanent Placement</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-slate-100">
                <img
                  src={execThumb}
                  alt="Clinical leadership and executive team"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: HEALTHCARE WORKFORCE SOLUTIONS */}
      <section id="workforce" className="py-20 bg-gradient-to-b from-[#F7FAFC] to-[#E7F5F2]/40 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-2">
            <div className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
              Specialized Service 04
            </div>
            <h2 className="text-3xl font-extrabold text-[#16324F]">
              Healthcare Workforce Solutions
            </h2>
            <p className="text-base text-[#526273]">
              Flexible, responsive staffing programs designed to optimize clinical labor costs and eliminate coverage gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E7F5F2] text-[#087F8C] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#16324F]">Per Diem & Rapid Surge</h3>
              <p className="text-xs sm:text-sm text-[#526273] leading-relaxed">
                On-demand shift coverage for unplanned call-outs, census spikes, seasonal illness surges, or emergency leaves of absence.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2F8] text-[#087F8C] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#16324F]">Contract & Travel Staffing</h3>
              <p className="text-xs sm:text-sm text-[#526273] leading-relaxed">
                13-week to 26-week contract assignments ensuring dependable staffing consistency across critical departments during transition periods.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E7F5F2] text-[#087F8C] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#16324F]">Contract-to-Hire Transitions</h3>
              <p className="text-xs sm:text-sm text-[#526273] leading-relaxed">
                Evaluate a clinician’s technical capability and unit culture fit on an active shift basis before finalizing a permanent employment contract.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: INTERACTIVE RECRUITMENT WORKFLOW */}
      <WorkflowJourney />

      {/* SECTION 8: INDUSTRIES WE SUPPORT (Dark Navy Feature Section) */}
      <section className="py-20 lg:py-24 bg-[#16324F] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#19A6A0] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#19A6A0]" />
              <span>Clinical Environments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Healthcare Facilities We Support
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Specialized clinical staffing tailored to the specific regulatory and operational demands of distinct healthcare settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-7 rounded-3xl border border-white/10 bg-white/5 space-y-3 hover:border-[#19A6A0]/40 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 border border-[#19A6A0]/30 flex items-center justify-center text-[#19A6A0]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9: CONTACT CTA */}
      <section className="py-20 bg-gradient-to-br from-[#E7F5F2] via-[#EAF2F8] to-[#DDF2F0]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Ready to Support Your Clinical Teams?
          </h2>
          <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
            Contact our healthcare staffing specialists today to discuss your workforce requirements or request immediate staffing support.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=organization"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
            >
              <span>Request Staffing Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
            >
              Speak with a Recruitment Advisor
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
