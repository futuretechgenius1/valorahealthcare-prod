import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LiveChatWidget from './components/LiveChatWidget';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StaffingServicesPage from './pages/StaffingServicesPage';
import NursingStaffingPage from './pages/NursingStaffingPage';
import AlliedHealthStaffingPage from './pages/AlliedHealthStaffingPage';
import PermanentPlacementPage from './pages/PermanentPlacementPage';
import WhyValoraPage from './pages/WhyValoraPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardHome from './pages/admin/DashboardHome';
import EnquiriesView from './pages/admin/EnquiriesView';
import EmployersView from './pages/admin/EmployersView';
import CandidatesView from './pages/admin/CandidatesView';
import StaffingRequestsView from './pages/admin/StaffingRequestsView';
import JobsView from './pages/admin/JobsView';
import ApplicationsView from './pages/admin/ApplicationsView';
import LiveChatView from './pages/admin/LiveChatView';
import MessagesView from './pages/admin/MessagesView';
import RecruitmentPipelineView from './pages/admin/RecruitmentPipelineView';
import UsersView from './pages/admin/UsersView';
import RolesView from './pages/admin/RolesView';
import ReportsView from './pages/admin/ReportsView';
import SettingsView from './pages/admin/SettingsView';
import AISettingsView from './pages/admin/AISettingsView';
import AIKnowledgeView from './pages/admin/AIKnowledgeView';
import AIAnalyticsView from './pages/admin/AIAnalyticsView';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#526273] font-body selection:bg-[#DDF2F0] selection:text-[#087F8C]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <LiveChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <SiteSettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/staffing-services" element={<StaffingServicesPage />} />
            <Route path="/nursing-staffing" element={<NursingStaffingPage />} />
            <Route path="/allied-health-staffing" element={<AlliedHealthStaffingPage />} />
            <Route path="/permanent-placement" element={<PermanentPlacementPage />} />
            <Route path="/why-valora" element={<WhyValoraPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="enquiries" element={<EnquiriesView />} />
              <Route path="employers" element={<EmployersView />} />
              <Route path="candidates" element={<CandidatesView />} />
              <Route path="staffing-requests" element={<StaffingRequestsView />} />
              <Route path="jobs" element={<JobsView />} />
              <Route path="applications" element={<ApplicationsView />} />
              <Route path="live-chat" element={<LiveChatView />} />
              <Route path="messages" element={<MessagesView />} />
              <Route path="recruitment" element={<RecruitmentPipelineView />} />
              <Route path="users" element={<UsersView />} />
              <Route path="roles" element={<RolesView />} />
              <Route path="reports" element={<ReportsView />} />
              <Route path="settings" element={<SettingsView />} />
              {/* AI & Automation Routes */}
              <Route path="ai-settings" element={<AISettingsView />} />
              <Route path="ai-knowledge" element={<AIKnowledgeView />} />
              <Route path="ai-analytics" element={<AIAnalyticsView />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </SiteSettingsProvider>
  </AdminAuthProvider>
);
}
