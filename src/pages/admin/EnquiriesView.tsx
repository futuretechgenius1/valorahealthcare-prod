import React, { useState, useEffect } from 'react';
import { Mail, Search, Trash2, CheckCircle2, Clock, AlertCircle, Edit3, X, Filter } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const EnquiriesView: React.FC = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getEnquiries({ status: statusFilter, search });
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await adminApi.updateEnquiry(id, { status, admin_notes: adminNotes });
      fetchEnquiries();
      if (selectedEnquiry) {
        setSelectedEnquiry({ ...selectedEnquiry, status, admin_notes: adminNotes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) return;
    try {
      await adminApi.deleteEnquiry(id);
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#16324F]">General Inquiries & Messages</h2>
          <p className="text-xs text-slate-500">Submissions received through Valora Healthcare contact and support channels</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] w-48 sm:w-64"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </form>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            No enquiries found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Subject & Type</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {enquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    onClick={() => {
                      setSelectedEnquiry(enquiry);
                      setAdminNotes(enquiry.admin_notes || '');
                    }}
                    className={`hover:bg-slate-50/80 cursor-pointer transition ${
                      selectedEnquiry?.id === enquiry.id ? 'bg-[#DDF2F0]/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{enquiry.name}</p>
                      <p className="text-slate-500 text-[11px]">{enquiry.email}</p>
                      {enquiry.phone && <p className="text-slate-400 text-[10px]">{enquiry.phone}</p>}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#16324F]">{enquiry.subject || 'Website Inquiry'}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {enquiry.inquiry_type || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-600 truncate">{enquiry.message}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          enquiry.status === 'new'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : enquiry.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(enquiry.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(enquiry.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete enquiry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Slideout / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-[#16324F]">Enquiry Details #{selectedEnquiry.id}</h3>
                <p className="text-xs text-slate-400">
                  Received on {new Date(selectedEnquiry.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Name</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedEnquiry.name}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Email</span>
                <p className="font-semibold text-[#087F8C] text-sm mt-0.5">{selectedEnquiry.email}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Phone</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedEnquiry.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Inquiry Type</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedEnquiry.inquiry_type || 'General'}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px]">Subject</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedEnquiry.subject || 'Website Inquiry'}</p>
            </div>

            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px]">Full Message</span>
              <div className="mt-1 p-4 bg-slate-50 rounded-2xl text-xs text-slate-700 whitespace-pre-wrap border border-slate-100">
                {selectedEnquiry.message}
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold text-xs mb-1">Internal Admin Notes</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log internal follow-up notes, phone calls, or recruiter assignment..."
                className="w-full p-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                {['new', 'in_progress', 'resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      selectedEnquiry.status === st
                        ? 'bg-[#087F8C] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleUpdateStatus(selectedEnquiry.id, selectedEnquiry.status)}
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

export default EnquiriesView;
