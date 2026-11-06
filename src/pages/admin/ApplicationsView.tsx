import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Download, FileText, CheckCircle2, Clock, X, Phone, Mail } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const ApplicationsView: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getApplications({ status: statusFilter, search });
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadApplications();
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await adminApi.updateApplication(id, { status, admin_notes: adminNotes });
      loadApplications();
      if (selectedApp) {
        setSelectedApp({ ...selectedApp, status, admin_notes: adminNotes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#16324F]">Candidate Applications</h2>
          <p className="text-xs text-slate-500">
            Direct job applications submitted through the Valora Healthcare Careers portal
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search applicant or job..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] w-48 sm:w-60"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </form>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-700 font-medium"
          >
            <option value="all">All Application Stages</option>
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer Extended</option>
            <option value="hired">Hired / Placed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            No job applications found matching filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Position Applied</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Resume</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app);
                      setAdminNotes(app.admin_notes || '');
                    }}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{app.applicant_name}</p>
                      <p className="text-slate-500 text-[11px]">{app.applicant_email}</p>
                      <p className="text-slate-400 text-[10px]">{app.applicant_phone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#16324F]">{app.job_title || 'General Talent Submission'}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-medium bg-[#DDF2F0] text-[#087F8C] px-2 py-0.5 rounded-md">
                        {app.job_department || app.profession || 'Clinical'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {app.experience || 'Experienced'}
                    </td>
                    <td className="py-3.5 px-4">
                      {app.resume_url ? (
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#087F8C] hover:underline bg-[#DDF2F0]/50 px-2.5 py-1 rounded-lg"
                        >
                          <FileText size={12} />
                          <span>Resume</span>
                          <Download size={11} />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">No file</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={app.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-xl border focus:outline-none capitalize ${
                          app.status === 'hired'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : app.status === 'interview'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : app.status === 'offer'
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : app.status === 'rejected'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="applied">Applied</option>
                        <option value="screening">Screening</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setAdminNotes(app.admin_notes || '');
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#DDF2F0] text-slate-700 hover:text-[#087F8C] rounded-lg text-xs font-semibold transition"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-[#16324F]">
                  Application #{selectedApp.id}
                </h3>
                <p className="text-xs text-[#087F8C] font-semibold">
                  For: {selectedApp.job_title || 'General Position Pool'}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Candidate</span>
                <p className="font-bold text-slate-800">{selectedApp.applicant_name}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Email</span>
                <p className="font-semibold text-[#087F8C]">{selectedApp.applicant_email}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Phone</span>
                <p className="font-semibold text-slate-800">{selectedApp.applicant_phone}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Experience Level</span>
                <p className="font-semibold text-slate-800">{selectedApp.experience || 'Experienced'}</p>
              </div>
            </div>

            {selectedApp.cover_note && (
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Cover Note / Candidate Statement</span>
                <p className="mt-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl whitespace-pre-wrap">
                  {selectedApp.cover_note}
                </p>
              </div>
            )}

            {selectedApp.resume_url && (
              <div className="p-3 bg-[#DDF2F0]/40 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#087F8C]" size={18} />
                  <span className="text-xs font-semibold text-slate-800">
                    {selectedApp.resume_filename || 'Candidate Resume'}
                  </span>
                </div>
                <a
                  href={selectedApp.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-[#087F8C] hover:bg-[#076E7A] text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
              </div>
            )}

            <div>
              <label className="block text-slate-600 font-bold text-xs mb-1">Recruitment Stage Notes</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log interview feedback, clinical credential check notes, or rate negotiations..."
                className="w-full p-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                {['screening', 'interview', 'offer', 'hired'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusUpdate(selectedApp.id, st)}
                    className={`px-3 py-1 text-xs font-bold rounded-xl capitalize transition ${
                      selectedApp.status === st
                        ? 'bg-[#087F8C] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleStatusUpdate(selectedApp.id, selectedApp.status)}
                className="px-4 py-2 bg-[#16324F] hover:bg-[#12263C] text-white text-xs font-bold rounded-xl transition"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsView;
