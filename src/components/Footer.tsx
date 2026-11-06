import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, HeartHandshake } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Footer() {
  const { logoUrl, siteName } = useSiteSettings();

  return (
    <footer className="bg-[#16324F] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-700/60">
          
          {/* Brand Column (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
            >
              {logoUrl ? (
                <div className="bg-white/10 p-1.5 rounded-xl border border-white/15 backdrop-blur-xs inline-flex items-center">
                  <img
                    src={logoUrl}
                    alt={siteName || 'Valora Healthcare'}
                    className="h-9 max-h-11 w-auto object-contain brightness-105"
                  />
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-[#087F8C] flex items-center justify-center text-white shadow-sm">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
                    </svg>
                  </div>
                  <span>
                    Valora <span className="text-[#4A90A4] font-semibold">Healthcare</span>
                  </span>
                </>
              )}
            </Link>
            
            <p className="text-xs uppercase tracking-widest text-[#4A90A4] font-semibold">
              Empowering People. Exceptional Care.
            </p>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              A modern healthcare staffing and recruitment company launched to connect forward-thinking medical organizations with dedicated clinical professionals through agile, people-first solutions.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
              <HeartHandshake className="w-4 h-4 text-[#19A6A0]" />
              <span>Launching Nationwide Healthcare Placement</span>
            </div>
          </div>

          {/* Quick Navigation (Col 5-6) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/why-valora" className="hover:text-white transition-colors">
                  Why Valora
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Staffing Services (Col 7-9) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Staffing Services
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/staffing-services" className="hover:text-white transition-colors font-medium text-slate-200">
                  Overview of Services
                </Link>
              </li>
              <li>
                <Link to="/nursing-staffing" className="hover:text-white transition-colors">
                  Nursing Staffing (RN, LPN, CNA)
                </Link>
              </li>
              <li>
                <Link to="/allied-health-staffing" className="hover:text-white transition-colors">
                  Allied Health & Therapy
                </Link>
              </li>
              <li>
                <Link to="/permanent-placement" className="hover:text-white transition-colors">
                  Permanent Placement
                </Link>
              </li>
              <li>
                <Link to="/staffing-services#workforce" className="hover:text-white transition-colors">
                  Workforce Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information (Col 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#4A90A4] mt-0.5 shrink-0" />
                <div>
                  <span className="block text-slate-400 text-xs">Toll-Free & Dispatch</span>
                  <a href="tel:18005550199" className="hover:text-white transition-colors text-white font-medium">
                    +1 (800) 555-0199
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#4A90A4] mt-0.5 shrink-0" />
                <div>
                  <span className="block text-slate-400 text-xs">Email Enquiries</span>
                  <a href="mailto:admin@valorahealthcare.com" className="hover:text-white transition-colors text-white">
                    admin@valorahealthcare.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#4A90A4] mt-0.5 shrink-0" />
                <div>
                  <span className="block text-slate-400 text-xs">Coverage</span>
                  <span className="text-white">Healthcare Facilities Nationwide, USA</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Valora Healthcare. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <Link to="/terms-and-conditions" className="hover:text-slate-200 transition-colors">
              Terms & Conditions
            </Link>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">
              Support
            </Link>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <Link to="/admin/login" className="text-teal-400/80 hover:text-teal-300 font-semibold transition-colors flex items-center gap-1">
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
