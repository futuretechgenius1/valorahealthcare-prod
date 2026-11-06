import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Download, Edit3, Trash2, X, FileText, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const CandidatesView: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [professionFilter, setProfessionFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // New Candidate Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    profession: 'Nursing',
    specialty: '',
    experience_years: '2-5 years',
    license_state: '',
    preferred_location: '',
    availability: 'Immediate',
    status: 'new',
    notes: '',
  });

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCandidates({
        status: statusFilter,
        profession: professionFilter,
        search,
      });
      setCandidates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [statusFilter, professionFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCandidates();
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await adminApi.updateCandidate(id, { status });
      loadCandidates();
      if (selectedCandidate) {
        setSelectedCandidate({ ...selectedCandidate, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createCandidate(formData);
      setModalOpen(false);
      loadCandidates();
    } catch (err: any) {
      alert(err.message || 'Error creating candidate');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this candidate profile?')) return;
    try {
      await adminApi.deleteCandidate(id);
      if (selectedCandidate?.id === id) setSelectedCandidate(null);
      loadCandidates();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#16324F]">Clinical Talent Pool</h2>
          <p className="text-xs text-slate-500">
            Registered nurses, allied health professionals, therapists, and healthcare leaders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search talent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] w-44 sm:w-56"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </form>

          <select
            value={professionFilter}
            onChange={(e) => setProfessionFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-700 font-medium"
          >
            <option value="all">All Disciplines</option>
            <option value="Nursing">Nursing</option>
            <option value="Allied Health">Allied Health</option>
            <option value="Therapy">Therapy</option>
            <option value="Leadership">Leadership</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-700 font-medium"
          >
            <option value="all">All Stages</option>
            <option value="new">New Candidate</option>
            <option value="screening">Screening</option>
            <option value="interviewing">Interviewing</option>
            <option value="placed">Placed</option>
            <option value="archived">Archived</option>
          </select>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#087F8C] to-[#19A6A0] hover:from-[#076E7A] hover:to-[#168E89] rounded-xl shadow-md shadow-[#087F8C]/20 transition"
          >
            <Plus size={15} />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            No candidate profiles found matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Talent Name</th>
                  <th className="py-3 px-4">Profession & Specialty</th>
                  <th className="py-3 px-4">Experience / State</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Resume</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {candidates.map((cand) => (
                  <tr
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">
                        {cand.first_name} {cand.last_name}
                      </p>
                      <p className="text-slate-500 text-[11px]">{cand.email}</p>
                      <p className="text-slate-400 text-[10px]">{cand.phone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#16324F]">{cand.profession}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-medium bg-[#DDF2F0] text-[#087F8C] px-2 py-0.5 rounded-md">
                        {cand.specialty || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-700">{cand.experience_years || '1-3 years'}</p>
                      <p className="text-slate-400 text-[11px]">
                        License: {cand.license_state || 'Verified'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium">
                        {cand.availability || 'Immediate'}
                      </span>
                      {cand.preferred_location && (
                        <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                          {cand.preferred_location}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {cand.resume_url ? (
                        <a
                          href={cand.resume_url}
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
                        <span className="text-slate-400 text-[11px] italic">Not attached</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={cand.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(cand.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-xl border focus:outline-none ${
                          cand.status === 'placed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : cand.status === 'screening'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : cand.status === 'interviewing'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="screening">Screening</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="placed">Placed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cand.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete candidate"
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

      {/* Candidate Profile Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#087F8C] text-white flex items-center justify-center font-bold">
                  {selectedCandidate.first_name[0]}
                  {selectedCandidate.last_name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#16324F]">
                    {selectedCandidate.first_name} {selectedCandidate.last_name}
                  </h3>
                  <p className="text-xs text-[#087F8C] font-semibold">
                    {selectedCandidate.profession} • {selectedCandidate.specialty}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Email</span>
                <p className="font-semibold text-slate-800">{selectedCandidate.email}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Phone</span>
                <p className="font-semibold text-slate-800">{selectedCandidate.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Experience</span>
                <p className="font-semibold text-slate-800">{selectedCandidate.experience_years}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Licensed State</span>
                <p className="font-semibold text-slate-800">{selectedCandidate.license_state || 'Any'}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Availability</span>
                <p className="font-semibold text-slate-800">{selectedCandidate.availability}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Preferred Area</span>
                <p className="font-semibold text-slate-800">{selectedCandidate.preferred_location || 'Flexible'}</p>
              </div>
            </div>

            {selectedCandidate.resume_url && (
              <div className="p-3 bg-[#DDF2F0]/40 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#087F8C]" size={18} />
                  <span className="text-xs font-semibold text-slate-800">
                    {selectedCandidate.resume_filename || 'Candidate Resume'}
                  </span>
                </div>
                <a
                  href={selectedCandidate.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-[#087F8C] hover:bg-[#076E7A] text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
              </div>
            )}

            {selectedCandidate.notes && (
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Candidate Background Notes</span>
                <p className="mt-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                  {selectedCandidate.notes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Stage:</span>
                {['new', 'screening', 'interviewing', 'placed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedCandidate.id, st)}
                    className={`px-2.5 py-1 text-xs rounded-xl font-bold transition capitalize ${
                      selectedCandidate.status === st
                        ? 'bg-[#087F8C] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#16324F]">Register Candidate to Talent Pool</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Profession *</label>
                  <select
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  >
                    <option value="Nursing">Nursing (RN / LPN / NP)</option>
                    <option value="Allied Health">Allied Health</option>
                    <option value="Physical Therapy">Physical Therapy (PT/PTA)</option>
                    <option value="Occupational Therapy">Occupational Therapy (OT/COTA)</option>
                    <option value="Speech-Language Pathology">Speech Pathology (SLP)</option>
                    <option value="Respiratory Therapy">Respiratory Therapy (RRT)</option>
                    <option value="Healthcare Leadership">Healthcare Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. ICU, ER, Med/Surg, OR"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience</label>
                  <select
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  >
                    <option value="< 1 year">&lt; 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-5 years">2-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State License</label>
                  <input
                    type="text"
                    placeholder="e.g. TX / Compact"
                    value={formData.license_state}
                    onChange={(e) => setFormData({ ...formData, license_state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="2 Weeks">2 Weeks Notice</option>
                    <option value="30 Days">30 Days</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Clinical certifications, BLS/ACLS expiry, preferences..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#087F8C] hover:bg-[#076E7A] rounded-xl shadow-md shadow-[#087F8C]/20"
                >
                  Register Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesView;
