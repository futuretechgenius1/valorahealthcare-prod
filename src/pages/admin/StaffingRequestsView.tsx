import React, { useState, useEffect } from 'react';
import { FileCheck, Search, Filter, AlertTriangle, CheckCircle2, Clock, Trash2, X, Building, Phone, Mail, MapPin } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const StaffingRequestsView: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getStaffingRequests({ status: statusFilter, search });
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadRequests();
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await adminApi.updateStaffingRequest(id, { status });
      loadRequests();
      if (selectedRequest) {
        setSelectedRequest({ ...selectedRequest, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriorityChange = async (id: number, priority: string) => {
    try {
      await adminApi.updateStaffingRequest(id, { priority });
      loadRequests();
      if (selectedRequest) {
        setSelectedRequest({ ...selectedRequest, priority });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this staffing request?')) return;
    try {
      await adminApi.deleteStaffingRequest(id);
      if (selectedRequest?.id === id) setSelectedRequest(null);
      loadRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#16324F]">Facility Staffing Requests</h2>
          <p className="text-xs text-slate-500">
            Incoming personnel orders from hospitals, clinical networks, and rehabilitation centers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search facility or role..."
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
            <option value="all">All Request Statuses</option>
            <option value="new">New</option>
            <option value="reviewing">Under Review</option>
            <option value="sourcing">Actively Sourcing</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            No staffing requests found matching current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Organization & Contact</th>
                  <th className="py-3 px-4">Roles Needed</th>
                  <th className="py-3 px-4">Positions / Shift</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Logged</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{req.organization_name}</p>
                      <p className="text-slate-500 text-[11px]">{req.contact_name}</p>
                      <p className="text-slate-400 text-[10px]">{req.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#16324F]">{req.roles_needed}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-medium bg-[#DDF2F0] text-[#087F8C] px-2 py-0.5 rounded-md">
                        {req.staffing_type || 'Staffing'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{req.number_of_positions || 1} clinician(s)</span>
                      <p className="text-slate-500 text-[11px]">{req.shift_preference || 'Flexible shifts'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          req.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : req.priority === 'high'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {req.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={req.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-xl border focus:outline-none ${
                          req.status === 'fulfilled'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : req.status === 'sourcing'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : req.status === 'reviewing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="sourcing">Sourcing</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(req.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(req.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete request"
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

      {/* Staffing Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-[#16324F]">
                  Staffing Order #{selectedRequest.id}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedRequest.organization_name} • Logged on {new Date(selectedRequest.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Contact Person</span>
                <p className="font-bold text-slate-800">{selectedRequest.contact_name}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Email</span>
                <p className="font-semibold text-[#087F8C]">{selectedRequest.email}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Phone</span>
                <p className="font-semibold text-slate-800">{selectedRequest.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Facility Type</span>
                <p className="font-semibold text-slate-800">{selectedRequest.facility_type || 'Hospital'}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Required Roles</span>
                <p className="font-bold text-[#16324F]">{selectedRequest.roles_needed}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Headcount</span>
                <p className="font-bold text-[#087F8C]">{selectedRequest.number_of_positions || 1} Clinicians</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Staffing Model</span>
                <p className="font-semibold text-slate-800">{selectedRequest.staffing_type}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Start Date</span>
                <p className="font-semibold text-slate-800">{selectedRequest.start_date || 'ASAP'}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Shift Preference</span>
                <p className="font-semibold text-slate-800">{selectedRequest.shift_preference || 'Flexible'}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Facility Location</span>
                <p className="font-semibold text-slate-800">{selectedRequest.location || 'Unspecified'}</p>
              </div>
            </div>

            {selectedRequest.details && (
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Special Requirements / Notes</span>
                <p className="mt-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl whitespace-pre-wrap">
                  {selectedRequest.details}
                </p>
              </div>
            )}

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Urgency Level:</span>
                <div className="flex items-center gap-1.5">
                  {['normal', 'high', 'urgent'].map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(selectedRequest.id, p)}
                      className={`px-3 py-1 text-xs font-bold rounded-xl uppercase transition ${
                        selectedRequest.priority === p
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Sourcing Workflow Stage:</span>
                <div className="flex items-center gap-1.5">
                  {['new', 'reviewing', 'sourcing', 'fulfilled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedRequest.id, st)}
                      className={`px-3 py-1 text-xs font-bold rounded-xl capitalize transition ${
                        selectedRequest.status === st
                          ? 'bg-[#087F8C] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffingRequestsView;
