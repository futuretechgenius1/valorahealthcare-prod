import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Mail,
  FileCheck,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Plus,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const [statsRes, activityRes, requestsRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getRecentActivity(),
        adminApi.getStaffingRequests({ status: 'all' }),
      ]);
      setStats(statsRes.stats);
      setActivity(activityRes.activity || []);
      setRecentRequests((requestsRes || []).slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Enquiries',
      value: stats?.enquiries || 0,
      badge: stats?.newEnquiries ? `${stats.newEnquiries} New` : 'All Caught Up',
      badgeColor: stats?.newEnquiries ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Mail,
      link: '/admin/enquiries',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'Partner Facilities',
      value: stats?.employers || 0,
      badge: `${stats?.activeEmployers || 0} Active`,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: Building2,
      link: '/admin/employers',
      color: 'from-[#087F8C] to-[#19A6A0]',
    },
    {
      title: 'Healthcare Talent',
      value: stats?.candidates || 0,
      badge: `${stats?.placedCandidates || 0} Placed`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Users,
      link: '/admin/candidates',
      color: 'from-teal-600 to-cyan-600',
    },
    {
      title: 'Staffing Requests',
      value: stats?.staffingRequests || 0,
      badge: `${stats?.openStaffingRequests || 0} In Progress`,
      badgeColor: stats?.openStaffingRequests ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-600 border-slate-200',
      icon: FileCheck,
      link: '/admin/staffing-requests',
      color: 'from-violet-600 to-purple-600',
    },
    {
      title: 'Active Job Postings',
      value: stats?.activeJobs || 0,
      badge: `${stats?.applications || 0} Applications`,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Briefcase,
      link: '/admin/jobs',
      color: 'from-slate-700 to-slate-900',
    },
    {
      title: 'Live Chat Inquiries',
      value: stats?.activeChats || 0,
      badge: 'Real-Time',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: MessageSquare,
      link: '/admin/live-chat',
      color: 'from-emerald-600 to-teal-700',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#16324F] tracking-tight">
            Healthcare Operations Command Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time synchronization with Valora Healthcare MySQL cluster (<span className="font-mono text-[11px] text-[#087F8C]">srv1786.hstgr.io</span>).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#087F8C] bg-slate-100 hover:bg-[#DDF2F0]/60 rounded-xl transition"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh Live Data</span>
          </button>
          <Link
            to="/admin/jobs"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#087F8C] to-[#19A6A0] hover:from-[#076E7A] hover:to-[#168E89] rounded-xl shadow-md shadow-[#087F8C]/20 transition"
          >
            <Plus size={15} />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.title}
              to={kpi.link}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#DDF2F0] to-white flex items-center justify-center text-[#087F8C] group-hover:scale-105 transition-transform">
                  <Icon size={24} />
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${kpi.badgeColor}`}
                >
                  {kpi.badge}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {kpi.title}
                </p>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-3xl font-extrabold text-[#16324F] tracking-tight">
                    {kpi.value}
                  </h3>
                  <span className="text-xs font-semibold text-[#087F8C] group-hover:translate-x-0.5 transition-transform flex items-center">
                    Manage <ArrowUpRight size={14} className="ml-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 2-Column Section: Urgent Staffing Requests & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Staffing Requests (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-[#16324F]">Recent Healthcare Staffing Requests</h3>
                <p className="text-xs text-slate-500">Live requests submitted by medical facilities</p>
              </div>
              <Link
                to="/admin/staffing-requests"
                className="text-xs font-semibold text-[#087F8C] hover:underline"
              >
                View All Requests →
              </Link>
            </div>

            <div className="mt-4 divide-y divide-slate-100 overflow-x-auto">
              {recentRequests.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No staffing requests in queue.
                </div>
              ) : (
                recentRequests.map((req) => (
                  <div key={req.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#16324F] truncate">
                          {req.organization_name}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {req.facility_type || 'Hospital'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        Needed: <span className="text-slate-800 font-medium">{req.roles_needed}</span> ({req.number_of_positions || 1} staff) • {req.location || 'Location TBD'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          req.status === 'new'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : req.status === 'sourcing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {req.status?.toUpperCase()}
                      </span>
                      <Link
                        to="/admin/staffing-requests"
                        className="text-xs font-bold text-[#087F8C] hover:text-[#076E7A] bg-[#DDF2F0]/60 hover:bg-[#DDF2F0] px-3 py-1.5 rounded-xl transition"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top 5 latest incoming requests</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle size={14} /> Database Connected
            </span>
          </div>
        </div>

        {/* Right Column: Live Audit Activity Feed (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-[#16324F]">System Activity Audit</h3>
              <p className="text-xs text-slate-500">Recent actions in MySQL log</p>
            </div>
            <Clock size={16} className="text-slate-400" />
          </div>

          <div className="mt-4 flex-1 max-h-[380px] overflow-y-auto space-y-3.5 pr-1">
            {activity.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No recent activity logged yet.
              </div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="text-xs border-l-2 border-[#087F8C] pl-3 py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{item.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{item.details || `${item.entity_type} #${item.entity_id}`}</p>
                  <span className="text-[10px] font-semibold text-[#087F8C]">
                    By: {item.admin_name || 'System'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
