import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function TermsConditionsPage() {
  return (
    <div className="bg-[#F7FAFC]">
      <PageMeta
        title="Terms and Conditions"
        description="Terms and Conditions governing the use of Valora Healthcare website, staffing services, and recruitment portal."
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/60 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-semibold tracking-widest text-[#087F8C] uppercase">
            Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16324F]">
            Terms and Conditions
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
            <h2 className="text-lg font-bold text-[#16324F]">1. Agreement to Terms</h2>
            <p>
              By accessing or using the website of Valora Healthcare ("Valora," "we," "us"), or submitting any candidate registration or client facility inquiry, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue using our services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">2. Scope of Healthcare Staffing Services</h2>
            <p>
              Valora Healthcare provides recruitment, screening, credentialing, and staffing placement services connecting licensed clinical professionals with healthcare facilities. Submission of an inquiry or registration does not guarantee placement, employment, or the availability of staffing fulfillment in every jurisdiction.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">3. Candidate Representations & Warranties</h2>
            <p>
              Healthcare professionals who register through our portal represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>All personal details, employment histories, license numbers, and credentials submitted are accurate, current, and complete.</li>
              <li>You hold valid, unencumbered professional licenses and certifications required for your stated clinical practice area.</li>
              <li>You will promptly notify Valora Healthcare of any changes in licensure status, investigations, or disciplinary proceedings.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">4. Healthcare Organization Clients</h2>
            <p>
              Healthcare facilities requesting staffing support agree that staffing fees, service agreements, cancelation terms, and shift coverage parameters are governed by formal Client Master Service Agreements (MSAs) executed prior to placement commencement.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">5. Intellectual Property Rights</h2>
            <p>
              All content on this website—including logos, trademarks, design layouts, graphics, text, and software code—is the proprietary property of Valora Healthcare and is protected by applicable copyright, trademark, and intellectual property laws. Unauthorized reproduction or commercial use is strictly prohibited.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Valora Healthcare shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or inability to access our website or services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">7. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the State in which staffing services are principally executed, without regard to conflict of law principles.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#16324F]">8. Amendments to Terms</h2>
            <p>
              Valora Healthcare reserves the right to modify these terms periodically. Continued use of our site following posted revisions constitutes acceptance of the updated terms.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link to="/" className="text-xs font-semibold text-[#087F8C] hover:underline">
              ← Return to Home
            </Link>
            <Link to="/privacy-policy" className="text-xs font-semibold text-[#087F8C] hover:underline">
              View Privacy Policy →
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
