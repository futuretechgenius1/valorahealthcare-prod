import { Link } from 'react-router-dom';
import { ArrowRight, Activity, FlaskConical, Scan, HeartPulse, Bone, Stethoscope, CheckCircle2, ShieldCheck } from 'lucide-react';
import PageMeta from '../components/PageMeta';
import alliedImg from '../assets/images/allied_health_therapy_1793939460829.jpg';
import doctorPatientImg from '../assets/images/doctor_patient_care_1793940438071.jpg';

export default function AlliedHealthStaffingPage() {
  const alliedDisciplines = [
    {
      icon: Bone,
      title: 'Physical Therapists (PT & PTA)',
      desc: 'Doctorate-level and licensed Physical Therapists specializing in orthopedic rehabilitation, neuro recovery, post-surgical mobilization, and geriatric physical therapy across inpatient and outpatient settings.',
      specialties: ['Inpatient Rehab', 'Outpatient Orthopedics', 'Neuro Recovery', 'Pediatric PT'],
      bg: 'from-[#E7F5F2] to-white',
    },
    {
      icon: Activity,
      title: 'Occupational Therapists (OT & COTA)',
      desc: 'Licensed Occupational Therapists skilled in activities of daily living (ADL) retraining, cognitive rehabilitation, fine motor recovery, ergonomic interventions, and adaptive equipment training.',
      specialties: ['Hand Therapy', 'Cognitive Rehab', 'Sensory Integration', 'Ergonomic Restoration'],
      bg: 'from-[#EAF2F8] to-white',
    },
    {
      icon: HeartPulse,
      title: 'Respiratory Therapists (RRT & CRT)',
      desc: 'Registered Respiratory Therapists adept at mechanical ventilation management, airway maintenance, blood gas analysis, aerosol therapy, and critical respiratory support in ICUs and EDs.',
      specialties: ['Ventilator Management', 'Arterial Blood Gas', 'Neonatal & Peds Respiration', 'Pulmonary Rehab'],
      bg: 'from-[#E7F5F2] to-white',
    },
    {
      icon: FlaskConical,
      title: 'Medical Laboratory Professionals',
      desc: 'Medical Technologists (MT), Medical Laboratory Scientists (MLS), and Medical Laboratory Technicians (MLT) performing precise diagnostic testing, hematology, chemistry, microbiology, and blood banking.',
      specialties: ['Clinical Chemistry', 'Hematology & Coagulation', 'Microbiology', 'Blood Bank / Immunohematology'],
      bg: 'from-[#EAF2F8] to-white',
    },
    {
      icon: Scan,
      title: 'Diagnostic Imaging Professionals',
      desc: 'ARRT-certified Radiologic Technologists, MRI Technologists, CT Technicians, Diagnostic Medical Sonographers (ARDMS), and Nuclear Medicine specialists operating state-of-the-art imaging modalities.',
      specialties: ['Computed Tomography (CT)', 'Magnetic Resonance (MRI)', 'Ultrasound / Sonography', 'X-Ray / Fluoroscopy'],
      bg: 'from-[#E7F5F2] to-white',
    },
    {
      icon: Stethoscope,
      title: 'Clinical Support Specialists',
      desc: 'Certified Medical Assistants (CMA), Phlebotomists, Dialysis Technicians, and Patient Care Technicians who streamline diagnostic and direct patient care workflows.',
      specialties: ['Venipuncture & Phlebotomy', 'Hemodialysis Support', 'Clinical Triage', 'Procedural Prep'],
      bg: 'from-[#EAF2F8] to-white',
    },
  ];

  return (
    <div className="bg-[#F7FAFC]">
      <PageMeta
        title="Allied Health Staffing Solutions – Therapy, Lab & Imaging"
        description="Connect with qualified Allied Health professionals including Physical Therapists, Occupational Therapists, Respiratory Therapists, Medical Lab Technologists, and Diagnostic Imaging specialists."
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-white via-[#EAF2F8]/30 to-[#F7FAFC] border-b border-slate-200/60 py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F5F2] border border-[#19A6A0]/20">
                <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
                <span className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                  Specialized Allied Health Staffing
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#16324F] leading-tight">
                Allied Health Staffing That Enhances Diagnostic and Restorative Care.
              </h1>

              <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
                We supply premier healthcare systems, imaging clinics, and rehabilitation facilities with licensed, credentialed therapists, laboratory scientists, and diagnostic imaging technologists.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/contact?type=organization"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
                >
                  <span>Request Allied Health Staff</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/careers"
                  className="px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
                >
                  Allied Professional Registration
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-100">
                <img
                  src={alliedImg}
                  alt="Physical therapist aiding patient mobility with care in modern clinic"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DISCIPLINES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087F8C] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
            <span>Allied Disciplines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Specialties and Allied Professions We Staff
          </h2>
          <p className="text-base text-[#526273]">
            Every allied health professional is screened against state licensing requirements, specialty registries, and verified clinical competence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alliedDisciplines.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`bg-gradient-to-b ${item.bg} p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#087F8C] text-white flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#16324F]">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#526273] leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-200/80 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#087F8C] font-semibold">
                  {item.specialties.map((s, idx) => (
                    <span key={s}>
                      {s} {idx < item.specialties.length - 1 ? '·' : ''}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* QUALITY & MODALITY STANDARDS (Dark Navy Section) */}
      <section className="py-20 lg:py-24 bg-[#16324F] text-white border-y border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#19A6A0] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#19A6A0]" />
                <span>Rigorous Screening</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Our Allied Health Credentialing Rigor
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Therapeutic and diagnostic errors cannot occur. Our verification team applies multi-layered scrutiny before any allied clinician is recommended to your facility.
              </p>
              
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#19A6A0] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Board & Registry Primary-Source Verification</span>
                    <span>State boards, ARRT, ASCP, NBRC, and NBCOT registries checked directly.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#19A6A0] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Equipment & Modality Competency Profiling</span>
                    <span>Experience verified on GE, Siemens, Philips, Beckman Coulter, and Abbott systems.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#19A6A0] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Mandatory Health & Exclusion Screenings</span>
                    <span>Full drug screens, background checks, immunizations, and OIG/SAM clearance.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white/5 border border-white/10 p-8 sm:p-10 rounded-3xl space-y-6">
              <h3 className="text-2xl font-bold text-white">Need Urgent Allied Health Coverage?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Whether you face an unexpected absence in your respiratory therapy unit, a backlog in diagnostic imaging, or require additional physical therapists to meet outpatient patient volumes, Valora Healthcare delivers rapid, dependable staffing.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact?type=organization"
                  className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#19A6A0] rounded-xl shadow-md transition-all"
                >
                  <span>Request Staffing Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-20 bg-gradient-to-br from-[#E7F5F2] via-[#EAF2F8] to-[#DDF2F0]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Empowering Your Allied Health Department
          </h2>
          <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
            Let’s discuss your therapy, laboratory, and imaging staffing requirements today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=organization"
              className="px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
            >
              Request Allied Staffing
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
            >
              Contact Our Recruitment Team
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
