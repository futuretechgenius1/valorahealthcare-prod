import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const { logoUrl, siteName } = useSiteSettings();

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  const isServicesActive =
    location.pathname === '/staffing-services' ||
    location.pathname === '/nursing-staffing' ||
    location.pathname === '/allied-health-staffing' ||
    location.pathname === '/permanent-placement';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Zone 1: Single Brand element */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#16324F] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
            aria-label="Valora Healthcare Home"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteName || 'Valora Healthcare'}
                className="h-9 sm:h-10 max-h-12 w-auto object-contain transition-all"
              />
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#087F8C] to-[#16324F] flex items-center justify-center text-white shadow-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
                  </svg>
                </div>
                <span>
                  Valora <span className="text-[#087F8C] font-semibold">Healthcare</span>
                </span>
              </>
            )}
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#526273]">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors hover:text-[#087F8C] whitespace-nowrap shrink-0 py-1 ${
                  isActive ? 'text-[#087F8C] font-semibold border-b-2 border-[#087F8C]' : ''
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors hover:text-[#087F8C] whitespace-nowrap shrink-0 py-1 ${
                  isActive ? 'text-[#087F8C] font-semibold border-b-2 border-[#087F8C]' : ''
                }`
              }
            >
              About Us
            </NavLink>

            {/* Services with Hover/Click Flyout */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <NavLink
                to="/staffing-services"
                className={`flex items-center gap-1 transition-colors hover:text-[#087F8C] whitespace-nowrap shrink-0 py-1 ${
                  isServicesActive ? 'text-[#087F8C] font-semibold border-b-2 border-[#087F8C]' : ''
                }`}
              >
                <span>Staffing Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </NavLink>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-2 flex flex-col gap-1">
                    <Link
                      to="/staffing-services"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="px-3 py-2 text-xs font-semibold text-[#16324F] hover:bg-[#DDF2F0]/40 rounded-lg transition-colors"
                    >
                      All Staffing Services Overview
                    </Link>
                    <div className="h-px bg-slate-100 my-1" />
                    <Link
                      to="/nursing-staffing"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="px-3 py-2 text-xs text-[#526273] hover:text-[#087F8C] hover:bg-[#DDF2F0]/40 rounded-lg transition-colors flex flex-col"
                    >
                      <span className="font-medium text-slate-900">Nursing Staffing</span>
                      <span className="text-[11px] text-slate-500">RNs, LPNs, CNAs & specialty units</span>
                    </Link>
                    <Link
                      to="/allied-health-staffing"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="px-3 py-2 text-xs text-[#526273] hover:text-[#087F8C] hover:bg-[#DDF2F0]/40 rounded-lg transition-colors flex flex-col"
                    >
                      <span className="font-medium text-slate-900">Allied Health Staffing</span>
                      <span className="text-[11px] text-slate-500">Therapists, imaging & diagnostics</span>
                    </Link>
                    <Link
                      to="/permanent-placement"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="px-3 py-2 text-xs text-[#526273] hover:text-[#087F8C] hover:bg-[#DDF2F0]/40 rounded-lg transition-colors flex flex-col"
                    >
                      <span className="font-medium text-slate-900">Permanent Placement</span>
                      <span className="text-[11px] text-slate-500">Direct-hire clinical & leadership</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/why-valora"
              className={({ isActive }) =>
                `transition-colors hover:text-[#087F8C] whitespace-nowrap shrink-0 py-1 ${
                  isActive ? 'text-[#087F8C] font-semibold border-b-2 border-[#087F8C]' : ''
                }`
              }
            >
              Why Valora
            </NavLink>

            <NavLink
              to="/careers"
              className={({ isActive }) =>
                `transition-colors hover:text-[#087F8C] whitespace-nowrap shrink-0 py-1 ${
                  isActive ? 'text-[#087F8C] font-semibold border-b-2 border-[#087F8C]' : ''
                }`
              }
            >
              Careers
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors hover:text-[#087F8C] whitespace-nowrap shrink-0 py-1 ${
                  isActive ? 'text-[#087F8C] font-semibold border-b-2 border-[#087F8C]' : ''
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="hidden sm:flex items-center shrink-0">
            <Link
              to="/contact?type=organization"
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
            >
              Request Staffing Support
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-[#DDF2F0] text-[#087F8C]' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-[#DDF2F0] text-[#087F8C]' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              About Us
            </NavLink>
            <div className="space-y-1">
              <NavLink
                to="/staffing-services"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-base font-medium flex items-center justify-between ${
                    isActive ? 'bg-[#DDF2F0] text-[#087F8C]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span>Staffing Services</span>
              </NavLink>
              <div className="pl-4 space-y-1">
                <Link
                  to="/nursing-staffing"
                  onClick={closeMenu}
                  className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#087F8C]"
                >
                  · Nursing Staffing
                </Link>
                <Link
                  to="/allied-health-staffing"
                  onClick={closeMenu}
                  className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#087F8C]"
                >
                  · Allied Health Staffing
                </Link>
                <Link
                  to="/permanent-placement"
                  onClick={closeMenu}
                  className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#087F8C]"
                >
                  · Permanent Placement
                </Link>
              </div>
            </div>
            <NavLink
              to="/why-valora"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-[#DDF2F0] text-[#087F8C]' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              Why Valora
            </NavLink>
            <NavLink
              to="/careers"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-[#DDF2F0] text-[#087F8C]' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              Careers
            </NavLink>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-[#DDF2F0] text-[#087F8C]' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              Contact
            </NavLink>

            <div className="pt-2">
              <Link
                to="/contact?type=organization"
                onClick={closeMenu}
                className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-lg shadow-sm"
              >
                Request Staffing Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
