import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hospital, Search, Users, ClipboardCheck, HeartHandshake, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Step {
  id: number;
  label: string;
  subtitle: string;
  icon: typeof Hospital;
  text: string;
  deliverables: string[];
  roleTarget: string;
}

export default function WorkflowJourney() {
  const steps: Step[] = [
    {
      id: 1,
      label: 'Understand',
      subtitle: 'Facility Needs Analysis',
      icon: Hospital,
      text: "Understanding the organization's staffing needs, clinical specialties, and workforce requirements.",
      deliverables: ['Department census review', 'EHR system competency matching', 'Shift schedule mapping (Days/Nights/PRN)'],
      roleTarget: 'For Healthcare Organizations',
    },
    {
      id: 2,
      label: 'Discover',
      subtitle: 'Candidate Discovery',
      icon: Search,
      text: 'Identifying potential healthcare professionals whose experience and qualifications align with the requirements.',
      deliverables: ['Active nationwide clinical network search', 'Specialty skill matching (ICU, ED, Telemetry, Therapy)', 'Availability & compact state verification'],
      roleTarget: 'Targeted Talent Sourcing',
    },
    {
      id: 3,
      label: 'Connect',
      subtitle: 'Meaningful Dialogue',
      icon: Users,
      text: 'Creating meaningful connections between healthcare organizations and potential candidates.',
      deliverables: ['Direct clinical coordinator introductions', 'Mutual shift & compensation alignment', 'Unit culture & expectation briefing'],
      roleTarget: 'Human-Centered Engagement',
    },
    {
      id: 4,
      label: 'Recruit',
      subtitle: 'Verification & Selection',
      icon: ClipboardCheck,
      text: 'Supporting recruitment coordination and professional selection discussions.',
      deliverables: ['Primary-source license validation', '10-panel drug & background clearance', 'Pre-shift orientation coordination'],
      roleTarget: 'Rigorous Credentialing',
    },
    {
      id: 5,
      label: 'Strengthen',
      subtitle: 'Care Team Synergy',
      icon: HeartHandshake,
      text: 'Helping organizations build stronger healthcare teams through meaningful professional partnerships.',
      deliverables: ['Day-one clinical integration', '24/7 dedicated shift support', 'Continuous retention & quality follow-ups'],
      roleTarget: 'Long-Term Clinical Excellence',
    },
  ];

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Auto-advance through the workflow steps every 4.5 seconds unless user is interacting
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % steps.length) + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  const currentStepData = steps.find((s) => s.id === activeStep) || steps[0];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-[#EAF2F8]/40 to-white border-y border-slate-200/70 relative overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#DDF2F0]/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E7F5F2]/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087F8C] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#19A6A0]" />
            <span>Interactive Recruitment Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-[#16324F] leading-tight">
            From Workforce Needs to Exceptional Healthcare Teams.
          </h2>
          <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
            Bringing healthcare organizations and qualified professionals together through a thoughtful recruitment journey.
          </p>
        </div>

        {/* Desktop Interactive Stepper */}
        <div
          className="hidden lg:block mb-12"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Horizontal Steps with Connecting Line */}
          <div className="relative flex items-center justify-between">
            {/* Background Base Line */}
            <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-1 bg-slate-200 z-0" />

            {/* Animated Progress Line */}
            <motion.div
              className="absolute top-1/2 left-10 -translate-y-1/2 h-1 bg-gradient-to-r from-[#087F8C] to-[#19A6A0] z-0"
              initial={false}
              animate={{
                width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ maxWidth: 'calc(100% - 5rem)' }}
            />

            {/* Steps Nodes */}
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === activeStep;
              const isPast = step.id < activeStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setActiveStep(step.id);
                    setIsAutoPlaying(false);
                  }}
                  className="relative z-10 flex flex-col items-center group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] rounded-2xl p-2 transition-transform hover:-translate-y-1"
                >
                  {/* Step Circle with Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                      isActive
                        ? 'bg-[#087F8C] text-white ring-4 ring-[#DDF2F0] scale-110 shadow-teal-500/20'
                        : isPast
                        ? 'bg-[#16324F] text-white'
                        : 'bg-white text-slate-400 border-2 border-slate-200 group-hover:border-[#087F8C] group-hover:text-[#087F8C]'
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <span
                      className={`block text-xs font-mono font-bold tracking-wider uppercase ${
                        isActive ? 'text-[#087F8C]' : 'text-slate-400'
                      }`}
                    >
                      Step 0{step.id}
                    </span>
                    <span
                      className={`block text-sm font-bold mt-0.5 ${
                        isActive ? 'text-[#16324F]' : 'text-slate-600 group-hover:text-[#16324F]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Detailed Card (Interactive Display) */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg shadow-slate-200/40 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#087F8C] via-[#19A6A0] to-[#16324F]" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left side: Icon & Title */}
                <div className="md:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#E7F5F2] text-[#087F8C]">
                    <span>Step 0{currentStepData.id} of 05</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentStepData.roleTarget}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#16324F]">
                    {currentStepData.label}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#19A6A0]">
                    {currentStepData.subtitle}
                  </p>
                  <p className="text-sm text-[#526273] leading-relaxed">
                    {currentStepData.text}
                  </p>
                </div>

                {/* Right side: Key Deliverables */}
                <div className="md:col-span-7 bg-[#F7FAFC] p-6 rounded-2xl border border-slate-200/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#16324F]">
                    Stage Deliverables & Verification
                  </h4>
                  <ul className="space-y-2.5">
                    {currentStepData.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#526273]">
                        <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Continuous clinical quality monitoring</span>
                    <Link
                      to="/staffing-services"
                      className="inline-flex items-center gap-1 font-semibold text-[#087F8C] hover:text-[#076f7a]"
                    >
                      <span>Explore Staffing Process</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Vertical Connected Timeline */}
        <div className="block lg:hidden mt-8 space-y-4">
          <div className="border-l-2 border-[#087F8C] ml-6 pl-6 space-y-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === activeStep;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#087F8C] shadow-md ring-1 ring-[#087F8C]'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Connected bullet marker */}
                  <div
                    className={`absolute -left-[35px] top-6 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                      isActive ? 'bg-[#087F8C]' : 'bg-[#16324F]'
                    }`}
                  >
                    0{step.id}
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#16324F]">{step.label}</h4>
                      <p className="text-[11px] text-[#087F8C] font-semibold">{step.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#526273] leading-relaxed">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
