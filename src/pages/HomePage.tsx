import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Stethoscope,
  Activity,
  UserCheck,
  Building2,
  Users,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import PageMeta from '../components/PageMeta';
import WorkflowJourney from '../components/WorkflowJourney';

// Images
import heroImg from '../assets/images/hero_healthcare_team_1793939459465.jpg';
import doctorPatientImg from '../assets/images/doctor_patient_care_1793940438071.jpg';
import execTeamImg from '../assets/images/clinical_executive_team_1793940437944.jpg';
import hospitalFacilityImg from '../assets/images/org_hospital_facility_1793940437996.jpg';
import careersDoctorImg from '../assets/images/careers_medical_professional_1793939460996.jpg';
import nursingImg from '../assets/images/nursing_clinical_specialist_1793939460288.jpg';
import alliedImg from '../assets/images/allied_health_therapy_1793939460829.jpg';

export default function HomePage() {
  return (
    <div className="bg-[#F7FAFC] overflow-x-hidden">
      <PageMeta
        title="Connecting Exceptional People with Exceptional Care"
        description="Valora Healthcare provides thoughtful healthcare staffing and recruitment solutions, connecting premier healthcare organizations with dedicated clinical professionals."
      />

      {/* SECTION 1: ANIMATED HERO */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-white via-[#EAF2F8]/30 to-[#F7FAFC] border-b border-slate-200/60">
        
        {/* Soft background ambient glow */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#DDF2F0]/50 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#E7F5F2]/60 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Animated Text & CTAs */}
            <motion.div
              className="lg:col-span-6 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Eyebrow Label */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F5F2] border border-[#19A6A0]/20"
              >
                <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
                <span className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                  Launching a Fresh Standard · People First. Care Always.
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-[3.35rem] font-extrabold text-[#16324F] leading-[1.12] tracking-tight"
              >
                Connecting Exceptional People with Exceptional Care.
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base sm:text-lg text-[#526273] leading-relaxed max-w-xl"
              >
                A modern healthcare staffing company launched to empower forward-thinking medical organizations with dedicated clinical professionals through agile, people-first recruitment.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
              >
                <Link
                  to="/staffing-services"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-md hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
                >
                  Connect With Us
                </Link>
              </motion.div>

              {/* Trust statement */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-[#526273]"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#087F8C]" />
                  <span>Primary-Source Credentialed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#087F8C]" />
                  <span>24/7 Clinical Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#087F8C]" />
                  <span>Founder-Led Dedication</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Layered Visual Composition & Floating Elements */}
            <motion.div
              className="lg:col-span-6 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            >
              {/* Main Primary Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[16/11]">
                <img
                  src={heroImg}
                  alt="Valora Healthcare clinical professionals collaborating in modern hospital ward"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16324F]/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Supporting Secondary Layer 1: Doctor-Patient Thumbnail (Bottom-Left) */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="hidden sm:block absolute -bottom-8 -left-6 w-44 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={doctorPatientImg}
                    alt="Doctor caring for patient"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-2 text-center bg-white">
                  <span className="text-[10px] font-bold text-[#16324F] uppercase tracking-wider block">
                    Compassionate Care
                  </span>
                </div>
              </motion.div>

              {/* Supporting Secondary Layer 2: Clinical Leadership Thumbnail (Top-Right) */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="hidden md:block absolute -top-6 -right-6 w-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={execTeamImg}
                    alt="Clinical leadership conference"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-2 text-center bg-white">
                  <span className="text-[10px] font-bold text-[#16324F] uppercase tracking-wider block">
                    Clinical Governance
                  </span>
                </div>
              </motion.div>

              {/* Floating Element 1: Healthcare Professionals */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-6 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E7F5F2] text-[#087F8C] flex items-center justify-center shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#16324F]">Healthcare Professionals</div>
                  <div className="text-[10px] text-[#19A6A0] font-semibold">Verified & Credentialed</div>
                </div>
              </motion.div>

              {/* Floating Element 2: Staffing Solutions */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2.5 z-20"
              >
                <div className="w-8 h-8 rounded-lg bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#16324F]">Staffing Solutions</div>
                  <div className="text-[10px] text-[#526273]">Rapid Response & PRN</div>
                </div>
              </motion.div>

              {/* Floating Element 3: Building Stronger Teams */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="hidden sm:flex absolute top-1/2 -right-4 -translate-y-1/2 bg-[#16324F] text-white px-3.5 py-2 rounded-xl shadow-xl items-center gap-2 z-20"
              >
                <HeartHandshake className="w-4 h-4 text-[#19A6A0]" />
                <span className="text-xs font-semibold">Building Stronger Teams</span>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 2: HEALTHCARE WORKFLOW (MAIN FEATURE) */}
      <WorkflowJourney />

      {/* SECTION 3: HUMAN CONNECTION (Dark Navy Background with ~50% image) */}
      <section className="py-20 lg:py-24 bg-[#16324F] text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#087F8C]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left side: Large Healthcare Photography (50% section) */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 aspect-[4/3] bg-slate-800">
                <img
                  src={doctorPatientImg}
                  alt="Doctor and clinical nurse interacting with patient in clean modern hospital"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-[#087F8C] text-white p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 border border-teal-400/30">
                <HeartHandshake className="w-6 h-6 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold uppercase tracking-wider">Compassion First</div>
                  <div className="text-[11px] text-teal-100">Every shift touches human lives</div>
                </div>
              </div>
            </div>

            {/* Right side: Animated Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#19A6A0] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#19A6A0]" />
                <span>The Human Foundation</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                People Are at the Heart of Everything We Do.
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Behind every healthcare organization is a team of dedicated professionals. We believe that connecting the right people with the right opportunities creates stronger healthcare environments.
              </p>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-sm text-slate-200 italic leading-relaxed">
                  "Exceptional healthcare cannot exist without exceptional professionals who feel valued, supported, and matched with facilities where their clinical skills thrive."
                </p>
                <div className="text-xs text-[#19A6A0] font-semibold">
                  — Valora Healthcare Clinical Philosophy
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#19A6A0] rounded-xl shadow-sm transition-all"
                >
                  <span>Learn About Our Purpose</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
                >
                  Speak with Our Team
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: OUR SERVICES (Combination of Image-led & Alternating Backgrounds) */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087F8C] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Healthcare Staffing Solutions.
          </h2>
          <p className="text-base sm:text-lg text-[#526273]">
            Tailored clinical staffing models designed to uphold care standards, eliminate shift vacancies, and strengthen operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Service Block 1: Nursing Staffing (Image Header + Soft Mint) */}
          <div className="bg-gradient-to-b from-[#E7F5F2] to-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={nursingImg}
                  alt="Registered nurse checking digital patient telemetry"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#087F8C] shadow-xs">
                  Acute & Post-Acute
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#087F8C] text-white flex items-center justify-center shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#16324F] group-hover:text-[#087F8C] transition-colors">
                  Nursing Staffing
                </h3>
                <p className="text-xs sm:text-sm text-[#526273] leading-relaxed">
                  Registered Nurses (RNs), LPNs, LVNs, and CNAs verified for acute care, ICU, telemetry, ER, and specialized inpatient units.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Link
                to="/nursing-staffing"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#087F8C] group-hover:text-[#076f7a]"
              >
                <span>Explore Service</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Service Block 2: Allied Health Staffing (Image Header + Soft Blue) */}
          <div className="bg-gradient-to-b from-[#EAF2F8] to-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={alliedImg}
                  alt="Physical therapist supporting patient mobility in modern clinic"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#087F8C] shadow-xs">
                  Therapy & Diagnostics
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#087F8C] text-white flex items-center justify-center shadow-xs">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#16324F] group-hover:text-[#087F8C] transition-colors">
                  Allied Health Staffing
                </h3>
                <p className="text-xs sm:text-sm text-[#526273] leading-relaxed">
                  Licensed physical, occupational, and respiratory therapists, medical lab technologists, and diagnostic imaging staff.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Link
                to="/allied-health-staffing"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#087F8C] group-hover:text-[#076f7a]"
              >
                <span>Explore Service</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Service Block 3: Permanent Placement (Executive Search + Soft Mint) */}
          <div className="bg-gradient-to-b from-[#E7F5F2] to-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={execTeamImg}
                  alt="Clinical leadership team collaborating in conference room"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#087F8C] shadow-xs">
                  Leadership & Direct-Hire
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#087F8C] text-white flex items-center justify-center shadow-xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#16324F] group-hover:text-[#087F8C] transition-colors">
                  Permanent Placement
                </h3>
                <p className="text-xs sm:text-sm text-[#526273] leading-relaxed">
                  Executive search and direct-hire recruitment for clinical leadership, nurse managers, and healthcare administrative leaders.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Link
                to="/permanent-placement"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#087F8C] group-hover:text-[#076f7a]"
              >
                <span>Explore Service</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Service Block 4: Healthcare Workforce Solutions (Navy/Teal Accent card) */}
          <div className="bg-gradient-to-b from-[#EAF2F8] to-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={hospitalFacilityImg}
                  alt="Hospital administration reviewing clinical workforce planning"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#087F8C] shadow-xs">
                  Surge & Flexible Models
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#087F8C] text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#16324F] group-hover:text-[#087F8C] transition-colors">
                  Workforce Solutions
                </h3>
                <p className="text-xs sm:text-sm text-[#526273] leading-relaxed">
                  Strategic per diem staffing, seasonal surge coverage, and contract-to-hire frameworks adapted to facility census swings.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Link
                to="/staffing-services"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#087F8C] group-hover:text-[#076f7a]"
              >
                <span>Explore Service</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: WHY VALORA (Dark Navy Feature Section) */}
      <section className="py-20 lg:py-24 bg-[#16324F] text-white border-y border-slate-800 relative overflow-hidden">
        {/* Animated backdrop mesh glow */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#087F8C]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#19A6A0]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#19A6A0] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#19A6A0]" />
              <span>A Fresh Approach</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Partner with a Modern Staffing Agency?
            </h2>
            <p className="text-base sm:text-lg text-slate-300">
              As a newly launched healthcare staffing partner, we bring unmatched responsiveness, zero corporate bureaucracy, and direct access to our founding team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Advantage 1 */}
            <div className="bg-white/5 border border-white/10 hover:border-[#19A6A0]/50 p-8 rounded-3xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 text-[#19A6A0] flex items-center justify-center border border-[#19A6A0]/30 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#19A6A0] transition-colors">
                People-First Approach
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Personal attention from our founding coordinators, ensuring clinicians and facility supervisors receive dedicated, human-first care.
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="bg-white/5 border border-white/10 hover:border-[#19A6A0]/50 p-8 rounded-3xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 text-[#19A6A0] flex items-center justify-center border border-[#19A6A0]/30 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#19A6A0] transition-colors">
                Modern Credentialing
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Built from day one around primary-source license validation, digital background audits, and clinical competency compliance.
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="bg-white/5 border border-white/10 hover:border-[#19A6A0]/50 p-8 rounded-3xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 text-[#19A6A0] flex items-center justify-center border border-[#19A6A0]/30 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#19A6A0] transition-colors">
                Agile Workforce Models
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Flexible contracts tailored to your exact census—free of the rigid, slow-moving tiers of legacy corporate agencies.
              </p>
            </div>

            {/* Advantage 4 */}
            <div className="bg-white/5 border border-white/10 hover:border-[#19A6A0]/50 p-8 rounded-3xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 text-[#19A6A0] flex items-center justify-center border border-[#19A6A0]/30 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#19A6A0] transition-colors">
                Founding Partnerships
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We are committed to earning your trust shift by shift, offering direct phone lines to our leadership and transparent communication.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link
              to="/why-valora"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#19A6A0] hover:text-white transition-colors"
            >
              <span>Explore The Full Valora Difference</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 6: TWO-SIDED CONNECTION (Image-backed split cards) */}
      <section className="py-20 lg:py-28 bg-[#F7FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087F8C] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
              <span>Two-Sided Healthcare Synergy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
              Join Our Growing Healthcare Community
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Card: Healthcare Organizations */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-white group flex flex-col justify-between">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                  src={hospitalFacilityImg}
                  alt="Hospital executive team planning clinical workforce"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16324F] via-[#16324F]/40 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#19A6A0] block">
                    For Medical Facilities
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">
                    Become a Founding Client Partner.
                  </h3>
                </div>
              </div>

              <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                <p className="text-sm sm:text-base text-[#526273] leading-relaxed">
                  Looking for dedicated healthcare professionals? Partner with our newly launched team to access attentive, agile staffing support tailored to your facility.
                </p>

                <ul className="space-y-2 text-xs text-[#526273]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
                    <span>Direct founder-level account management & transparent rates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
                    <span>Primary-source license and competency verification</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Link
                    to="/contact?type=organization"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
                  >
                    <span>Request Founding Partner Proposal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Card: Healthcare Professionals */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-white group flex flex-col justify-between">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                  src={careersDoctorImg}
                  alt="Compassionate healthcare professional smiling in medical clinic"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16324F] via-[#16324F]/40 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#19A6A0] block">
                    For Clinical Specialists
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">
                    Join Our Inaugural Clinical Roster.
                  </h3>
                </div>
              </div>

              <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                <p className="text-sm sm:text-base text-[#526273] leading-relaxed">
                  Be among the first clinical professionals to launch with Valora Healthcare. Enjoy personal coordinator attention, top pay packages, and high-quality facility matches.
                </p>

                <ul className="space-y-2 text-xs text-[#526273]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
                    <span>Personal one-on-one career advocacy and top compensation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
                    <span>Local contracts, per diem, and direct placement opportunities</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Link
                    to="/careers"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#16324F] bg-[#E7F5F2] hover:bg-[#DDF2F0] border border-[#19A6A0]/30 rounded-xl shadow-xs transition-colors"
                  >
                    <span>Register as Inaugural Clinician</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA (Soft teal-to-blue gradient) */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#E7F5F2] via-[#EAF2F8] to-[#DDF2F0] border-t border-slate-200/60 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          
          <div className="w-14 h-14 rounded-2xl bg-white text-[#087F8C] shadow-md flex items-center justify-center mx-auto">
            <HeartHandshake className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#16324F] tracking-tight">
            Together, We Can Strengthen Healthcare.
          </h2>

          <p className="text-base sm:text-lg text-[#526273] leading-relaxed max-w-2xl mx-auto">
            Let's create meaningful connections between healthcare organizations and exceptional professionals.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-md hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
            >
              <span>Contact Valora Healthcare</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/staffing-services"
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
            >
              View All Services
            </Link>
          </div>

          <div className="pt-6 text-xs text-[#526273]">
            Or speak directly with our clinical staffing coordinators: <a href="tel:18005550199" className="font-semibold text-[#16324F] hover:text-[#087F8C]">+1 (800) 555-0199</a>
          </div>

        </div>
      </section>

    </div>
  );
}
