import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F7FAFC]">
      <PageMeta
        title="Privacy Policy"
        description="Valora Healthcare Privacy Policy regarding data collection, credential verification, and personal information handling for candidates and healthcare organizations."
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/60 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-semibold tracking-widest text-[#087F8C] uppercase">
            Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Effective Date: January 1, 2026 · Last Updated: November 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 text-sm text-[#526273] leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">1. Introduction</h2>
            <p>
              Valora Healthcare ("Valora," "we," "us," or "our") respects the privacy of individuals who interact with our healthcare staffing services, digital platform, and websites. This Privacy Policy describes how we collect, use, process, and protect your personal and professional information when you use our website or register as a healthcare candidate or client facility.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">2. Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when submitting staffing requests, registering as a clinical professional, or contacting our team:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-slate-900">Healthcare Professionals:</strong> Full legal name, email address, phone number, mailing address, clinical credentials (RN, LPN, CNA, PT, etc.), professional licenses, certifications (BLS, ACLS), resume or curriculum vitae, specialty experience, and geographic preferences.
              </li>
              <li>
                <strong className="text-slate-900">Healthcare Organizations:</strong> Facility name, contact person name and title, official work email, telephone number, department staffing requirements, census needs, and contractual specifications.
              </li>
              <li>
                <strong className="text-slate-900">Technical & Usage Data:</strong> Standard server logs, browser type, operating system, and pages visited to ensure site functionality, responsiveness, and security.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">3. How We Use Your Information</h2>
            <p>We use collected data solely for legitimate healthcare recruitment and staffing operations:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Matching clinical candidates with open facility staffing requests and shifts.</li>
              <li>Conducting required primary-source license and credential verification with state licensing boards.</li>
              <li>Facilitating employer interviews, onboarding orientations, and assignment scheduling.</li>
              <li>Responding to organizational inquiries and providing workforce proposals.</li>
              <li>Complying with applicable federal, state, and healthcare regulatory reporting standards.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">4. Disclosure of Information</h2>
            <p>
              We do not sell, rent, or trade personal data to third-party advertisers. We disclose your information only under specific, business-necessary circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-slate-900">Prospective Healthcare Employers:</strong> With candidate consent, candidate profiles and verified credentials are shared with client hospitals and clinics considering candidate placement.
              </li>
              <li>
                <strong className="text-slate-900">Verification Providers:</strong> Authorized background check vendors, drug screening laboratories, and credential verification agencies necessary to fulfill healthcare facility compliance.
              </li>
              <li>
                <strong className="text-slate-900">Legal Compliance:</strong> When required by lawful court order, subpoena, or relevant public health authority mandate.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">5. Data Security & Storage</h2>
            <p>
              We implement industry-standard physical, procedural, and technological safeguards to protect personal data against unauthorized access, loss, or disclosure. Clinical and credentialing records are maintained on secure, encrypted servers with strict role-based access controls.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">6. Your Rights & Choices</h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections to inaccurate credentials or contact details, or request that your profile be deactivated from active staffing consideration. You may exercise these choices by contacting our privacy compliance desk.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">7. Contact Our Privacy Team</h2>
            <p>
              If you have questions regarding this Privacy Policy or our clinical data practices, please reach out to:
            </p>
            <div className="p-4 rounded-xl bg-[#F7FAFC] border border-slate-200 text-xs text-[#16324F] space-y-1">
              <div className="font-semibold">Valora Healthcare Compliance Department</div>
              <div>Email: <a href="mailto:admin@valorahealthcare.com" className="text-[#087F8C] underline">admin@valorahealthcare.com</a></div>
              <div>Toll-Free Phone: +1 (800) 555-0199</div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link to="/" className="text-xs font-semibold text-[#087F8C] hover:underline">
              ← Return to Home
            </Link>
            <Link to="/terms-and-conditions" className="text-xs font-semibold text-[#087F8C] hover:underline">
              View Terms & Conditions →
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
