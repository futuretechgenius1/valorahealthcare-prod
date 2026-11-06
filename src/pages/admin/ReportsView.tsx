import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, Users, Building2, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const ReportsView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        setStats(data.stats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportCSV = () => {
    const headers = 'Metric,Value\n';
    const rows = [
      `Total Enquiries,${stats?.enquiries || 0}`,
      `Healthcare Partner Facilities,${stats?.employers || 0}`,
      `Registered Candidates,${stats?.candidates || 0}`,
      `Placed Candidates,${stats?.placedCandidates || 0}`,
      `Staffing Requests,${stats?.staffingRequests || 0}`,
      `Published Job Postings,${stats?.activeJobs || 0}`,
      `Applications Received,${stats?.applications || 0}`,
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valora-healthcare-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#16324F]">Executive Reports & Analytics</h2>
          <p className="text-xs text-slate-500">
            Performance metrics, staffing fulfillment velocity, and candidate placement summaries
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#16324F] bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition"
        >
          <Download size={14} />
          <span>Export Summary (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#16324F]">Placement Fulfillment</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Real-Time
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Active Candidates</span>
                <span>{stats?.candidates || 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#087F8C] h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Successful Placements</span>
                <span>{stats?.placedCandidates || 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#16324F]">Facility Client Health</h3>
            <span className="text-xs font-bold text-[#087F8C] bg-[#DDF2F0] px-2.5 py-0.5 rounded-full">
              Partnerships
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <span className="text-slate-600">Total Registered Facilities</span>
              <span className="font-bold text-slate-900 text-sm">{stats?.employers || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50/60 rounded-2xl">
              <span className="text-emerald-800 font-medium">Active Staffing Contracts</span>
              <span className="font-bold text-emerald-700 text-sm">{stats?.activeEmployers || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#16324F]">Inbound Volume</h3>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
              Channels
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <span className="text-slate-600">Website Enquiries</span>
              <span className="font-bold text-slate-900 text-sm">{stats?.enquiries || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-2xl">
              <span className="text-blue-800 font-medium">Job Applications</span>
              <span className="font-bold text-blue-700 text-sm">{stats?.applications || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
