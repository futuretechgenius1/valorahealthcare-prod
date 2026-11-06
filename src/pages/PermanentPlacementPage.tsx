import { Link } from 'react-router-dom';
import { ArrowRight, UserCheck, ShieldCheck, Search, Users, Award, Briefcase, CheckCircle2 } from 'lucide-react';
import PageMeta from '../components/PageMeta';
import execImg from '../assets/images/clinical_executive_team_1793940437944.jpg';
import hospitalFacilityImg from '../assets/images/org_hospital_facility_1793940437996.jpg';

export default function PermanentPlacementPage() {
  const servicePillars = [
    {
      icon: StethoscopeIcon,
      title: 'Clinical Direct-Hire Staffing',
      desc: 'Permanent placement of experienced staff nurses, specialized charge nurses, nurse practitioners, physician assistants, and allied clinicians seeking long-term tenure in your organization.',
      bg: 'from-[#E7F5F2] to-white',
    },
    {
      icon: Award,
      title: 'Healthcare Leadership & Executive Search',
      desc: 'Targeted headhunting for Directors of Nursing (DON), Chief Nursing Officers (CNO), Nurse Managers, Department Chairs, and Hospital Operations Leaders.',
      bg: 'from-[#EAF2F8] to-white',
    },
    {
      icon: Briefcase,
      title: 'Healthcare Administrative Recruitment',
      desc: 'Sourcing vital administrative and operational professionals including Health Information Management (HIM) directors, practice managers, compliance officers, and revenue cycle leaders.',
      bg: 'from-[#E7F5F2] to-white',
    },
    {
      icon: Users,
      title: 'High-Volume Permanent Clinical Batches',
      desc: 'Scalable recruitment campaigns for newly opened units, facility expansions, or system-wide staffing modernizations requiring cohorts of permanent clinicians.',
      bg: 'from-[#EAF2F8] to-white',
    },
  ];

  const methodologySteps = [
    {
      num: '01',
      title: 'Organizational & Culture Profiling',
      text: 'We assess the specific leadership philosophy, facility environment, patient population, and long-term vision to define the ideal candidate persona.',
    },
    {
      num: '02',
      title: 'Proactive National Candidate Identification',
      text: 'We leverage proprietary healthcare talent networks and proactive headhunting to engage high-performing passive candidates who are not actively browsing job boards.',
    },
    {
      num: '03',
      title: 'Competency & Leadership Screening',
      text: 'In-depth behavioral interviews, clinical background verification, leadership track record evaluation, and primary-source credential auditing.',
    },
    {
      num: '04',
      title: 'Coordinated Interviewing & Offer Negotiation',
      text: 'We streamline candidate presentations, coordinate interview panels, facilitate transparent feedback, and assist in structured offer negotiations.',
    },
    {
      num: '05',
      title: 'Placement Guarantee & Transition Check-in',
      text: 'Our commitment extends beyond day one with structured retention check-ins and comprehensive placement replacement guarantees.',
    },
  ];

  function StethoscopeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    );
  }

  return (
    <div className="bg-[#F7FAFC]">
      <PageMeta
        title="Permanent Placement & Healthcare Direct-Hire Recruitment"
        description="Strategic direct-hire healthcare recruitment for clinical practitioners, nurse managers, and healthcare leadership. Build enduring institutional strength with Valora Healthcare."
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-white via-[#EAF2F8]/30 to-[#F7FAFC] border-b border-slate-200/60 py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F5F2] border border-[#19A6A0]/20">
                <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
                <span className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                  Permanent Clinical & Leadership Recruitment
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#16324F] leading-tight">
                Permanent Placement Built for Longevity and Institutional Impact.
              </h1>

              <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
                When temporary coverage isn’t enough, Valora Healthcare identifies and recruits exceptional permanent clinical talent and healthcare leaders dedicated to your organization’s long-term mission.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/contact?type=organization"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
                >
                  <span>Initiate a Permanent Search</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/why-valora"
                  className="px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
                >
                  Learn Our Differentiators
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-100">
                <img
                  src={execImg}
                  alt="Clinical leadership executive search conference"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE RECRUITMENT VERTICALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087F8C] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
            <span>Specialized Search Verticals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Direct-Hire Healthcare Placement Specialties
          </h2>
          <p className="text-base text-[#526273]">
            Targeted search disciplines tailored to clinical bedside longevity and executive administrative governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicePillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`bg-gradient-to-b ${item.bg} p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#087F8C] text-white flex items-center justify-center shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#16324F]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#526273] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* METHODOLOGY (Dark Navy Feature Section) */}
      <section className="py-20 lg:py-24 bg-[#16324F] text-white border-y border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-14 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#19A6A0] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#19A6A0]" />
              <span>Recruitment Lifecycle</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Our Precision Candidate Identification Methodology
            </h2>
            <p className="text-base text-slate-300">
              A structured, high-touch process that filters out mismatched candidates and delivers only top-tier finalists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {methodologySteps.map((step) => (
              <div key={step.num} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2 hover:border-[#19A6A0]/40 transition-all">
                <span className="text-xs font-bold text-[#19A6A0] font-mono tracking-widest">
                  STAGE {step.num}
                </span>
                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS FOR EMPLOYERS */}
      <section className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
                <span>Measurable ROI</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
                Benefits of Valora Permanent Placement
              </h2>
              <p className="text-base text-[#526273] leading-relaxed">
                Vacant clinical positions cost thousands of dollars each day in overtime and compromised patient capacity. Partnering with Valora Healthcare delivers strategic advantages.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087F8C] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Reduced Time-to-Hire</h4>
                    <p className="text-xs text-[#526273]">Access pre-vetted active and passive healthcare candidates without waiting months for job board applications.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087F8C] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Drastic Drop in Cost-Per-Hire</h4>
                    <p className="text-xs text-[#526273]">Eliminate ongoing expensive contract premiums by securing dedicated full-time talent for key units.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087F8C] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Higher 1-Year Clinical Retention</h4>
                    <p className="text-xs text-[#526273]">Our cultural vetting and realistic job expectations result in significantly higher first-year retention rates.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087F8C] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Placement Replacement Guarantee</h4>
                    <p className="text-xs text-[#526273]">Every permanent direct placement is backed by our comprehensive warranty period for absolute peace of mind.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#E7F5F2]/50 p-8 sm:p-10 rounded-3xl border border-[#19A6A0]/20 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#087F8C] text-white flex items-center justify-center shadow-xs">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#16324F]">
                Start a Confidential Direct-Hire Search
              </h3>
              <p className="text-sm text-[#526273] leading-relaxed">
                Connect with our senior healthcare recruitment advisors to discuss your specialized clinical or executive leadership vacancy.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact?type=organization"
                  className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
                >
                  <span>Submit Permanent Position Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#E7F5F2] via-[#EAF2F8] to-[#DDF2F0]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Strengthen Your Healthcare Organization Today
          </h2>
          <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
            Let Valora Healthcare connect your facility with dedicated professionals who elevate patient care and clinical culture.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=organization"
              className="px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
            >
              Request Permanent Staffing Support
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
            >
              Speak with a Recruiter
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
