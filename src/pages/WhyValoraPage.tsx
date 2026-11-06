import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, ShieldCheck, MessageSquare, Layers, Award, Users, CheckCircle2 } from 'lucide-react';
import PageMeta from '../components/PageMeta';
import careImg from '../assets/images/about_care_leadership_1793939459557.jpg';
import doctorPatientImg from '../assets/images/doctor_patient_care_1793940438071.jpg';

export default function WhyValoraPage() {
  const storyChapters = [
    {
      number: '01',
      title: 'Our People-First Philosophy',
      tagline: 'Healthcare is inherently human.',
      content:
        'In an era dominated by cold automated algorithms and faceless job boards, we never lose sight of the fact that clinical care is personal. We view healthcare professionals not as numbers on a schedule, but as compassionate individuals answering a high calling. By respecting their well-being, shift preferences, and career trajectories, we attract more dedicated, dependable, and fulfilled clinicians to your facilities.',
      bg: 'bg-white',
    },
    {
      number: '02',
      title: 'Healthcare-Focused Recruitment Exclusivity',
      tagline: 'Deep domain expertise, not general staffing.',
      content:
        'We don’t staff warehouses, call centers, or hospitality on the side. We specialize exclusively in healthcare. Our recruiters understand clinical acronyms, department pressures, nurse-to-patient ratios, EHR nuances, and state licensing reciprocity rules. When you speak with Valora Healthcare, you speak with professionals who understand healthcare realities.',
      bg: 'bg-[#E7F5F2]/50',
    },
    {
      number: '03',
      title: 'Tailored Workforce Solutions',
      tagline: 'No rigid, one-size-fits-all contracts.',
      content:
        'Every healthcare institution has a unique operating rhythm. A rural critical access hospital requires different staffing support than a metropolitan trauma center or an outpatient surgical network. We custom-engineer staffing solutions—from per diem and rapid response surge coverage to 13-week travel contracts and direct executive placements—tailored strictly to your facility census and budget.',
      bg: 'bg-white',
    },
    {
      number: '04',
      title: 'Transparent, Professional Communication',
      tagline: 'Real answers. Zero ghosting. Direct access.',
      content:
        'Staffing coordinators and clinical directors cannot afford vague promises or endless email chains. Valora Healthcare provides dedicated single points of contact who communicate clearly, honestly, and promptly. If a shift cannot be filled, we tell you immediately and present alternative solutions rather than leaving you in the dark.',
      bg: 'bg-[#EAF2F8]/50',
    },
    {
      number: '05',
      title: 'Uncompromising Commitment to Quality',
      tagline: 'Joint Commission-aligned compliance standards.',
      content:
        'Our primary-source verification standard ensures that zero unverified providers ever set foot in your facilities. From exhaustive background checks and 10-panel drug screens to active board registry audits and clinical skills demonstrations, our clinicians uphold unyielding patient safety.',
      bg: 'bg-white',
    },
    {
      number: '06',
      title: 'A Partnership-Driven Approach',
      tagline: 'Working as a natural extension of your team.',
      content:
        'We measure our success by long-term clinical harmony and facility stability. We partner alongside your internal HR and nursing leadership to identify seasonal trends, forecast staffing bottlenecks, and build reliable talent pipelines that safeguard patient outcomes year-round.',
      bg: 'bg-[#E7F5F2]/50',
    },
  ];

  return (
    <div className="bg-[#F7FAFC]">
      <PageMeta
        title="Why Valora – A Partnership Built on People and Trust"
        description="Discover the Valora Healthcare difference: people-first philosophy, healthcare-focused recruitment, tailored workforce models, and uncompromising clinical quality."
      />

      {/* HERO (Distinctive Dark Navy & Deep Teal Theme) */}
      <section className="bg-[#16324F] text-white py-16 lg:py-24 relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#087F8C]/25 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#19A6A0]/30 text-[#19A6A0]">
                <span className="w-2 h-2 rounded-full bg-[#19A6A0]" />
                <span className="text-xs font-bold tracking-widest uppercase">
                  A New Healthcare Standard
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                Built from the Ground Up for Today's Healthcare Realities.
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                We launched Valora Healthcare to solve the frustrations facilities face with legacy staffing agencies: impersonal call centers, hidden markups, and delayed fills. We deliver direct founder accountability and agile clinical matches from day one.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/contact?type=organization"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#19A6A0] rounded-xl shadow-md transition-all"
                >
                  <span>Become a Founding Client</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/careers"
                  className="px-7 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
                >
                  Join Founding Clinician Roster
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/3] bg-slate-800">
                <img
                  src={careImg}
                  alt="Clinical leadership team collaborating"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STORYTELLING CHAPTERS */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {storyChapters.map((chapter) => (
            <div
              key={chapter.number}
              className={`${chapter.bg} rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-all`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#087F8C] font-mono tracking-widest">
                    CHAPTER {chapter.number}
                  </span>
                  <span className="text-slate-300 font-light">|</span>
                  <span className="text-xs font-bold text-[#16324F] uppercase tracking-wider">
                    {chapter.tagline}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16324F]">
                  {chapter.title}
                </h2>
                <p className="text-base text-[#526273] leading-relaxed">
                  {chapter.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HUMAN CONNECTION STRIP */}
      <section className="py-20 bg-[#16324F] text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3 p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 text-[#19A6A0] flex items-center justify-center mx-auto border border-[#19A6A0]/30">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Human Connection</h3>
              <p className="text-xs sm:text-sm text-slate-300">Real clinical recruiters who listen, advise, and support you throughout every shift.</p>
            </div>

            <div className="space-y-3 p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 text-[#19A6A0] flex items-center justify-center mx-auto border border-[#19A6A0]/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Rigorous Standards</h3>
              <p className="text-xs sm:text-sm text-slate-300">Zero compromises on clinical licenses, certifications, and background verification.</p>
            </div>

            <div className="space-y-3 p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 text-[#19A6A0] flex items-center justify-center mx-auto border border-[#19A6A0]/30">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Lasting Trust</h3>
              <p className="text-xs sm:text-sm text-slate-300">Built for enduring institutional stability, not transactional shift churning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-20 bg-gradient-to-br from-[#E7F5F2] via-[#EAF2F8] to-[#DDF2F0]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Experience the Valora Healthcare Difference
          </h2>
          <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
            Let’s start a conversation about elevating your healthcare workforce and delivering exceptional care together.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=organization"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
            >
              <span>Connect with Our Leadership</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/careers"
              className="px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
            >
              Explore Healthcare Opportunities
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
