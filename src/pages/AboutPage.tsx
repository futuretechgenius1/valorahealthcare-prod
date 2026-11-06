import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Target, Eye, Award, CheckCircle2, ArrowRight, Sparkles, Rocket, Users, Clock } from 'lucide-react';
import PageMeta from '../components/PageMeta';
import PartnerDeliveryWorkflow from '../components/PartnerDeliveryWorkflow';
import aboutImg from '../assets/images/about_care_leadership_1793939459557.jpg';
import execImg from '../assets/images/clinical_executive_team_1793940437944.jpg';

export default function AboutPage() {
  const coreValues = [
    {
      icon: Heart,
      title: 'People-First Compassion',
      description: 'We founded Valora Healthcare on a fundamental belief: healthcare is deeply human. We treat clinicians with the empathy and dignity they deserve, ensuring they never feel like just another number.',
      color: 'from-[#E7F5F2] to-white',
    },
    {
      icon: ShieldCheck,
      title: 'Clinical Integrity from Day One',
      description: 'As a newly launched agency, we have built our credentialing and compliance infrastructure from the ground up to exceed Joint Commission quality guidelines and primary-source standards.',
      color: 'from-[#EAF2F8] to-white',
    },
    {
      icon: Rocket,
      title: 'Agile & Responsive Support',
      description: 'Free from the bureaucratic drag of legacy staffing conglomerates, our founding coordinators provide rapid answers, personalized shift matching, and real-time support.',
      color: 'from-[#E7F5F2] to-white',
    },
    {
      icon: Award,
      title: 'Earning Long-Term Trust',
      description: 'Because we are launching our company, our reputation rests on every clinician we place. We invest deeply in every founding partnership with transparent communication.',
      color: 'from-[#EAF2F8] to-white',
    },
  ];

  return (
    <div className="bg-[#F7FAFC]">
      <PageMeta
        title="About Us – A Fresh Standard in Healthcare Staffing"
        description="Learn about Valora Healthcare, our founding story, our launch mission, and how we are building a more responsive, human-centered healthcare staffing partner."
      />

      {/* SECTION 1: HERO */}
      <section className="bg-gradient-to-b from-white via-[#EAF2F8]/30 to-[#F7FAFC] border-b border-slate-200/60 py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F5F2] border border-[#19A6A0]/20">
                <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
                <span className="text-xs font-bold tracking-widest text-[#087F8C] uppercase">
                  A New Healthcare Staffing Journey
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-[#16324F] leading-tight">
                A Fresh Perspective in Healthcare Staffing.
              </h1>
              
              <p className="text-base sm:text-lg text-[#526273] leading-relaxed max-w-2xl">
                Valora Healthcare was founded to redefine how clinical workforce solutions are delivered. As a newly launched agency, we bring fresh energy, agile technology, and deeply personal dedication to medical facilities and dedicated clinicians.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/contact?type=organization"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
                >
                  <span>Become a Founding Client Partner</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/careers"
                  className="px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
                >
                  Join Our Inaugural Clinical Roster
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3]">
                <img
                  src={aboutImg}
                  alt="Valora Healthcare founders discussing compassionate patient care standards"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block absolute -bottom-5 -left-5 bg-[#16324F] text-white p-4 rounded-2xl shadow-xl max-w-xs border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#087F8C] flex items-center justify-center text-white shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Built for Today's Healthcare</div>
                    <div className="text-[11px] text-slate-300">Modern, agile, and transparent</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: WHY WE LAUNCHED (Authentic Startup Story) */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087F8C] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
              <span>Our Founding Story</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F] leading-tight">
              Why We Started Valora Healthcare
            </h2>
            
            <div className="space-y-4 text-sm sm:text-base text-[#526273] leading-relaxed">
              <p>
                Healthcare facilities are facing historic workforce pressures—from unpredictable census spikes to severe clinical burnout. Yet, traditional staffing agencies have grown distant, bureaucratic, and slow to adapt.
              </p>
              <p>
                We launched Valora Healthcare with a singular conviction: there has to be a better way. A company where medical facilities don't get lost in automated ticket queues, and where nurses and therapists are recognized as valued healthcare professionals rather than interchangeable shift commodities.
              </p>
              <p>
                By building modern recruitment processes from the ground up, we offer healthcare organizations direct access to our founding leadership, transparent billing, and clinical talent thoroughly verified against the highest standards of safety and care.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="block text-2xl font-extrabold text-[#087F8C]">Agile</span>
                <span className="text-xs text-[#526273]">Modern Workflows</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="block text-2xl font-extrabold text-[#16324F]">Personal</span>
                <span className="text-xs text-[#526273]">Founder-Led Touch</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="block text-2xl font-extrabold text-[#19A6A0]">100%</span>
                <span className="text-xs text-[#526273]">Vetted from Day 1</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[16/11]">
              <img
                src={execImg}
                alt="Valora Healthcare founding clinical leadership team"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16324F]/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3 & 4: MISSION & LAUNCH VISION (Dark Navy Contrast) */}
      <section className="py-20 lg:py-24 bg-[#16324F] text-white border-y border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#087F8C]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#19A6A0] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#19A6A0]" />
              <span>Our Purpose & Direction</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Our Launch Mission & Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Mission Box */}
            <div className="bg-white/5 border border-white/10 hover:border-[#19A6A0]/40 p-8 sm:p-10 rounded-3xl transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 text-[#19A6A0] flex items-center justify-center border border-[#19A6A0]/30">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold tracking-widest text-[#19A6A0] uppercase">
                Our Mission
              </div>
              <h3 className="text-2xl font-bold text-white">
                To elevate patient outcomes by building honest, dependable healthcare teams.
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                We empower healthcare organizations with dedicated professionals through responsive, thoughtful staffing and recruitment solutions that prioritize clinical competency, dignity, and human connection.
              </p>
            </div>

            {/* Vision Box */}
            <div className="bg-white/5 border border-white/10 hover:border-[#19A6A0]/40 p-8 sm:p-10 rounded-3xl transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#087F8C]/40 text-[#19A6A0] flex items-center justify-center border border-[#19A6A0]/30">
                <Eye className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold tracking-widest text-[#19A6A0] uppercase">
                Our Vision
              </div>
              <h3 className="text-2xl font-bold text-white">
                To become the most dependable and respected new voice in healthcare staffing.
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                We envision a healthcare staffing landscape free of empty promises, where facilities have a trustworthy partner who answers every call, and clinicians find fulfilling assignments where their skills truly matter.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: FOUNDATIONAL VALUES */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087F8C] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
            <span>Foundational Commitments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Our Core Values
          </h2>
          <p className="text-base text-[#526273]">
            As a newly launched company, these foundational values guide every clinical match and conversation we undertake.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className={`bg-gradient-to-b ${val.color} p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 space-y-4`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#087F8C] text-white flex items-center justify-center shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#16324F]">{val.title}</h3>
                <p className="text-xs sm:text-sm text-[#526273] leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: OUR APPROACH & PARTNER DELIVERY WORKFLOW */}
      <PartnerDeliveryWorkflow />

      {/* SECTION 7: CLOSING CTA */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#E7F5F2] via-[#EAF2F8] to-[#DDF2F0] border-t border-slate-200/60">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Shape the Future of Healthcare Staffing with Us
          </h2>
          <p className="text-base sm:text-lg text-[#526273] leading-relaxed">
            Whether you are a healthcare facility looking for a fresh, attentive staffing partner or a clinical professional seeking assignments where you are truly valued, let's start this journey together.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=organization"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-sm transition-all"
            >
              <span>Partner with Our Founding Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/careers"
              className="px-7 py-3.5 text-sm font-semibold text-[#16324F] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
            >
              Register as an Inaugural Clinician
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
