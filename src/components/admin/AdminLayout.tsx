import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  Building2,
  Users,
  Briefcase,
  FileCheck,
  MessageSquare,
  GitBranch,
  ShieldCheck,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  ExternalLink,
  Menu,
  X,
  Lock,
  Search,
  Bot,
  BookOpen,
  Sparkles,
  Radio,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { adminApi } from '../../services/adminApi';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const { logoUrl, siteName } = useSiteSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [agentPresence, setAgentPresence] = useState<'online' | 'busy' | 'offline'>('online');
  const [showPresenceMenu, setShowPresenceMenu] = useState(false);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Send regular agent heartbeat to backend
  useEffect(() => {
    adminApi.sendPresenceHeartbeat(agentPresence).catch(() => {});
    const interval = setInterval(() => {
      adminApi.sendPresenceHeartbeat(agentPresence).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [agentPresence]);

  const handlePresenceChange = async (status: 'online' | 'busy' | 'offline') => {
    setAgentPresence(status);
    setShowPresenceMenu(false);
    try {
      await adminApi.updatePresenceStatus(status);
    } catch (e) {
      // quiet fallback
    }
  };

  useEffect(() => {
    // Fetch notifications
    const loadNotifications = async () => {
      try {
        const data = await adminApi.getNotifications();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      } catch (e) {
        // quiet fallback
      }
    };
    loadNotifications();
    const interval = setInterval(loadNotifications, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkNotificationsRead = async () => {
    try {
      await adminApi.markNotificationsRead();
      setUnreadCount(0);
    } catch (e) {
      // ignore
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    try {
      await adminApi.changePassword(currentPassword, newPassword);
      setPasswordMsg({ text: 'Password successfully changed!', error: false });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMsg(null);
        setCurrentPassword('');
        setNewPassword('');
      }, 1500);
    } catch (err: any) {
      setPasswordMsg({ text: err.message || 'Failed to update password', error: true });
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Enquiries', path: '/admin/enquiries', icon: Mail },
    { name: 'Healthcare Facilities', path: '/admin/employers', icon: Building2 },
    { name: 'Talent Pool', path: '/admin/candidates', icon: Users },
    { name: 'Staffing Requests', path: '/admin/staffing-requests', icon: FileCheck },
    { name: 'Job Postings', path: '/admin/jobs', icon: Briefcase },
    { name: 'Applications', path: '/admin/applications', icon: Briefcase },
    { name: 'Live Chat', path: '/admin/live-chat', icon: MessageSquare },
    { name: 'Contact Messages', path: '/admin/messages', icon: Mail },
    { name: 'Recruitment Pipeline', path: '/admin/recruitment', icon: GitBranch },
    { name: 'Admin Users', path: '/admin/users', icon: UserCheck },
    { name: 'Roles & Access', path: '/admin/roles', icon: ShieldCheck },
    { name: 'Analytics & Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const aiNavItems = [
    { name: 'AI Configuration', path: '/admin/ai-settings', icon: Bot },
    { name: 'Knowledge Base', path: '/admin/ai-knowledge', icon: BookOpen },
    { name: 'AI Usage & Analytics', path: '/admin/ai-analytics', icon: Sparkles },
  ];

  const currentNav =
    [...navItems, ...aiNavItems].find((item) => location.pathname.startsWith(item.path)) || navItems[0];

  return (
    <div className="min-h-screen bg-[#F5F8FA] flex font-sans text-[#344054]">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#16324F] text-white flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            {logoUrl ? (
              <div className="bg-white/10 p-1 rounded-xl border border-white/10 inline-flex items-center shrink-0">
                <img
                  src={logoUrl}
                  alt={siteName || 'Valora Admin'}
                  className={`object-contain transition-all ${collapsed ? 'w-8 h-8' : 'max-h-8 max-w-[120px]'}`}
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#087F8C] to-[#19A6A0] flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                V
              </div>
            )}
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                  VALORA
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-[#19A6A0] uppercase">
                  Admin Portal
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-[#087F8C] text-white shadow-sm shadow-[#087F8C]/40 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
                title={collapsed ? item.name : undefined}
              >
                <Icon size={18} className="flex-shrink-0 transition-transform group-hover:scale-105" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}

          {/* AI & Automation Menu Section */}
          <div className="pt-4 pb-1">
            {!collapsed ? (
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#19A6A0]/80">
                AI & Automation
              </div>
            ) : (
              <div className="border-t border-white/10 my-2" />
            )}
          </div>

          {aiNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#087F8C] to-[#19A6A0] text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
                title={collapsed ? item.name : undefined}
              >
                <Icon size={18} className="flex-shrink-0 text-[#19A6A0] group-hover:text-white transition-colors" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-white/10 bg-[#12263C]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#087F8C] flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              {!collapsed && (
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.role || 'Super Admin'}</p>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#16324F] tracking-tight">{currentNav.name}</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Valora Healthcare Operations Management</p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Agent Presence Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPresenceMenu(!showPresenceMenu);
                  setShowNotifications(false);
                  setShowProfileMenu(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-xs font-semibold bg-white"
                title="Set your agent presence"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    agentPresence === 'online'
                      ? 'bg-emerald-500 animate-pulse'
                      : agentPresence === 'busy'
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                />
                <span className="capitalize text-slate-700 hidden sm:inline">{agentPresence}</span>
              </button>

              {showPresenceMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                  <button
                    onClick={() => handlePresenceChange('online')}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Online</span>
                  </button>
                  <button
                    onClick={() => handlePresenceChange('busy')}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Busy</span>
                  </button>
                  <button
                    onClick={() => handlePresenceChange('offline')}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Offline</span>
                  </button>
                </div>
              )}
            </div>

            {/* Link to public website */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-[#087F8C] bg-[#DDF2F0]/60 hover:bg-[#DDF2F0] px-3 py-1.5 rounded-xl transition"
            >
              <span>View Website</span>
              <ExternalLink size={13} />
            </a>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                  if (!showNotifications && unreadCount > 0) {
                    handleMarkNotificationsRead();
                  }
                }}
                className="p-2 text-slate-600 hover:text-[#087F8C] hover:bg-slate-100 rounded-xl relative transition"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#16324F]">Operational Alerts</span>
                    <span className="text-xs text-slate-400">{notifications.length} recent</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400">No new notifications</div>
                    ) : (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            setShowNotifications(false);
                            if (notif.link) navigate(notif.link);
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition ${
                            !notif.is_read ? 'bg-[#DDF2F0]/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-800">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-[#16324F] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-[#087F8C] font-medium leading-none">{user?.role || 'Super Admin'}</p>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Lock size={14} className="text-slate-400" />
                    <span>Change Password</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/admin/settings');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings size={14} className="text-slate-400" />
                    <span>System Settings</span>
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#16324F]">Change Admin Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {passwordMsg && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-medium ${
                  passwordMsg.error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#087F8C] hover:bg-[#076E7A] rounded-xl transition shadow-md shadow-[#087F8C]/20"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
