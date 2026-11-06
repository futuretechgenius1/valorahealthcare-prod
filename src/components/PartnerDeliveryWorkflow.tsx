import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShieldCheck,
  UserCheck,
  Headphones,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Activity,
  Award,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stage {
  id: number;
  stageNum: string;
  title: string;
  tagline: string;
  icon: typeof Search;
  description: string;
  bullets: string[];
  systemMetric: string;
  simulatedData: {
    title: string;
    items: { label: string; status: string; detail: string }[];
    badge: string;
  };
}

export default function PartnerDeliveryWorkflow() {
  const stages: Stage[] = [
    {
      id: 1,
      stageNum: '01',
      title: 'Modern Needs Discovery',
      tagline: 'Census & Specialty Mapping',
      icon: Search,
      description:
        'We consult directly with clinical managers and department supervisors to map patient volume swings, EHR preferences, and exact specialty proficiencies.',
      bullets: [
        'Direct consultation with unit nursing leadership',
        'Specialty mapping (ICU, Emergency, Med-Surg, Therapy)',
        'Shift schedule modeling (Day, Night, PRN Surge)',
      ],
      systemMetric: '100% Customized Facility Profile',
      simulatedData: {
        title: 'Census & Unit Requirement Mapping',
        badge: 'Profile Active',
        items: [
          { label: 'Intensive Care Unit (ICU)', status: 'Active Request', detail: 'ACLS / Ventilator Competency Required' },
          { label: 'Emergency Department (ED)', status: 'Mapped', detail: 'Trauma & Triage Protocol Ready' },
          { label: 'EHR Compatibility', status: 'Matched', detail: 'Epic & Cerner Certified Clinicians' },
        ],
      },
    },
    {
      id: 2,
      stageNum: '02',
      title: 'Primary-Source Vetting',
      tagline: 'Multi-Layered Clinical Verification',
      icon: ShieldCheck,
      description:
        'Built from the ground up to exceed regulatory standards. Every clinician is audited via primary-source verification before submission.',
      bullets: [
        'Direct state board unencumbered license validation',
        'OIG, SAM/GSA, and nationwide criminal background checks',
        '10-panel drug screenings and comprehensive health titers',
      ],
      systemMetric: 'Zero Unverified Clinicians',
      simulatedData: {
        title: 'Real-Time Credentialing Terminal',
        badge: 'Verified Primary-Source',
        items: [
          { label: 'State Board Licensure', status: 'Verified', detail: 'Unencumbered · Good Standing' },
          { label: 'OIG & SAM/GSA Check', status: 'Cleared', detail: 'Zero Exclusion Records Found' },
          { label: 'Clinical Skills Assessment', status: '98.8%', detail: 'Passed Specialty Pharmacology & Care Exam' },
        ],
      },
    },
    {
      id: 3,
      stageNum: '03',
      title: 'Hands-On Onboarding',
      tagline: 'Seamless Day-One Integration',
      icon: UserCheck,
      description:
        'Our founding placement team personally coordinates badging, facility orientation alignment, and supervisor introductions to prevent start-of-shift confusion.',
      bullets: [
        'Facility badge and parking access coordination',
        'Pre-shift EHR credentials checklist validation',
        'Direct alignment with unit charge nurse and supervisor',
      ],
      systemMetric: 'Day-One Shift Readiness',
      simulatedData: {
        title: 'Pre-Shift Onboarding Readiness',
        badge: 'Ready to Care',
        items: [
          { label: 'Hospital Facility Badge', status: 'Approved', detail: 'Security Badge Packet Prepared' },
          { label: 'Unit Protocol Briefing', status: 'Completed', detail: 'Unit Policy & Codes Reviewed' },
          { label: 'Charge Nurse Connect', status: 'Confirmed', detail: 'Direct Welcome & Hand-off Scheduled' },
        ],
      },
    },
    {
      id: 4,
      stageNum: '04',
      title: 'Founder-Led Support',
      tagline: '24/7 Clinical Accountability',
      icon: Headphones,
      description:
        'As a newly launched company, our founders are directly accessible. We monitor shift attendance, solicit supervisor feedback, and resolve challenges in minutes.',
      bullets: [
        'Direct phone lines to founding leadership & coordinators',
        '24/7 active shift emergency dispatch coverage',
        'Weekly retention audits and clinical performance reviews',
      ],
      systemMetric: 'Direct Leadership Access',
      simulatedData: {
        title: '24/7 Shift Pulse & Quality Oversight',
        badge: 'Live Oversight',
        items: [
          { label: 'Active Shift Hotline', status: '24/7 Online', detail: 'Direct Coordinator Support Line' },
          { label: 'Shift Check-in Confirmation', status: '100% On-Time', detail: 'Verified Arrival & Check-in' },
          { label: 'Supervisor Satisfaction Score', status: '99.4%', detail: 'Clinical Excellence & Teamwork Rating' },
        ],
      },
    },
  ];

  const [activeStage, setActiveStage] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Auto-play through stages every 5.5s unless hovered
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev % stages.length) + 1);
    }, 5500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, stages.length]);

  const currentStage = stages.find((s) => s.id === activeStage) || stages[0];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-[#E7F5F2]/40 to-white border-y border-slate-200/70 relative overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#DDF2F0]/50 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#EAF2F8]/60 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F5F2] border border-[#19A6A0]/20">
            <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
            <span className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
              Modern Methodology & Workflow
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-[#16324F] leading-tight">
            How We Deliver for Our Partners
          </h2>
          <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
            A modern, four-stage process engineered to ensure clinical safety, seamless integration, and zero delays.
          </p>
        </div>

        {/* Desktop Interactive Stepper Tabs with Connecting Line */}
        <div
          className="hidden md:block mb-12"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="relative">
            {/* Background Base Bar */}
            <div className="absolute top-8 left-12 right-12 h-1 bg-slate-200 z-0 rounded-full" />

            {/* Animated Active Progress Line */}
            <motion.div
              className="absolute top-8 left-12 h-1 bg-gradient-to-r from-[#087F8C] via-[#19A6A0] to-[#087F8C] z-0 rounded-full"
              initial={false}
              animate={{
                width: `${((activeStage - 1) / (stages.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ maxWidth: 'calc(100% - 6rem)' }}
            />

            {/* 4 Interactive Buttons */}
            <div className="grid grid-cols-4 gap-4 relative z-10">
              {stages.map((stage) => {
                const Icon = stage.icon;
                const isActive = stage.id === activeStage;
                const isPast = stage.id < activeStage;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => {
                      setActiveStage(stage.id);
                      setIsAutoPlaying(false);
                    }}
                    className="flex flex-col items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] rounded-2xl p-2 cursor-pointer transition-transform hover:-translate-y-1"
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                        isActive
                          ? 'bg-[#087F8C] text-white ring-4 ring-[#DDF2F0] scale-110 shadow-teal-500/25'
                          : isPast
                          ? 'bg-[#16324F] text-white'
                          : 'bg-white text-slate-400 border-2 border-slate-200 group-hover:border-[#087F8C] group-hover:text-[#087F8C]'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Step Labels */}
                    <div className="mt-3 text-center space-y-0.5">
                      <span
                        className={`block text-xs font-mono font-bold tracking-widest uppercase ${
                          isActive ? 'text-[#087F8C]' : 'text-slate-400'
                        }`}
                      >
                        STAGE {stage.stageNum}
                      </span>
                      <span
                        className={`block text-sm font-bold ${
                          isActive ? 'text-[#16324F]' : 'text-slate-600 group-hover:text-[#16324F]'
                        }`}
                      >
                        {stage.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Dynamic Display Panel */}
        <div
          className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl shadow-slate-200/50 relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Top subtle gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#087F8C] via-[#19A6A0] to-[#16324F]" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
            >
              
              {/* Left Column: Stage Detail & Deliverables */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#E7F5F2] text-[#087F8C] border border-[#19A6A0]/20">
                  <span className="font-mono font-bold">Stage {currentStage.stageNum} of 04</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentStage.systemMetric}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#16324F]">
                    {currentStage.title}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#19A6A0]">
                    {currentStage.tagline}
                  </p>
                  <p className="text-sm sm:text-base text-[#526273] leading-relaxed pt-1">
                    {currentStage.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#16324F]">
                    Standard Deliverables & Oversight:
                  </h4>
                  <ul className="space-y-2.5">
                    {currentStage.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#526273]">
                        <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <Link
                    to="/contact?type=organization"
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-xs transition-all"
                  >
                    <span>Request Partner Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-xs text-slate-400">Direct founder coordination</span>
                </div>
              </div>

              {/* Right Column: Live Simulated Visual Monitor / Digital Card */}
              <div className="lg:col-span-6">
                <div className="bg-gradient-to-br from-[#16324F] to-[#12283f] text-white p-7 sm:p-8 rounded-3xl shadow-xl border border-slate-700/80 space-y-6 relative overflow-hidden">
                  
                  {/* Subtle decorative glow inside card */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#087F8C]/30 rounded-full blur-2xl pointer-events-none" />

                  {/* Header of Visual Simulator */}
                  <div className="flex items-center justify-between border-b border-slate-700 pb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#087F8C] text-white flex items-center justify-center shadow-xs">
                        <Activity className="w-5 h-5 text-teal-100" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{currentStage.simulatedData.title}</h4>
                        <span className="text-[11px] text-slate-400">Valora Staffing Operating System</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#19A6A0]/20 text-[#19A6A0] border border-[#19A6A0]/30">
                      {currentStage.simulatedData.badge}
                    </span>
                  </div>

                  {/* Simulated Status Rows */}
                  <div className="space-y-3 relative z-10">
                    {currentStage.simulatedData.items.map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 hover:border-[#19A6A0]/40 p-3.5 rounded-2xl flex items-center justify-between gap-4 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <span className="block text-xs font-bold text-white">{item.label}</span>
                          <span className="block text-[11px] text-slate-300">{item.detail}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#19A6A0] bg-[#19A6A0]/10 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                          {item.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer of Monitor */}
                  <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#19A6A0] animate-pulse" />
                      <span>Active Quality Safeguards</span>
                    </div>
                    <span>Joint Commission Criteria Aligned</span>
                  </div>

                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Navigation Pills */}
        <div className="block md:hidden mt-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {stages.map((stage) => {
              const isActive = stage.id === activeStage;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(stage.id)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    isActive
                      ? 'bg-[#087F8C] text-white border-[#087F8C] shadow-md'
                      : 'bg-white text-[#16324F] border-slate-200'
                  }`}
                >
                  <span className="block text-[10px] uppercase font-mono opacity-80">Stage 0{stage.id}</span>
                  <span className="truncate block">{stage.title}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
