import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Plus, Edit2, Trash2, X, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const JobsView: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Nursing',
    job_type: 'Travel / Contract',
    location: '',
    pay_range: '',
    description: '',
    requirements: '',
    benefits: '',
    status: 'published',
  });

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getJobs({ status: statusFilter, search });
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs();
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: 'Nursing',
      job_type: 'Travel / Contract',
      location: '',
      pay_range: '',
      description: '',
      requirements: '',
      benefits: '',
      status: 'published',
    });
    setModalOpen(true);
  };

  const openEditModal = (job: any) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      job_type: job.job_type,
      location: job.location,
      pay_range: job.pay_range || '',
      description: job.description,
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      status: job.status || 'published',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await adminApi.updateJob(editingJob.id, formData);
      } else {
        await adminApi.createJob(formData);
      }
      setModalOpen(false);
      loadJobs();
    } catch (err: any) {
      alert(err.message || 'Error saving job');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await adminApi.deleteJob(id);
      loadJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#16324F]">Clinical Job Postings</h2>
          <p className="text-xs text-slate-500">
            Current career opportunities published to the Valora Healthcare website
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] w-48 sm:w-56"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </form>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#087F8C] to-[#19A6A0] hover:from-[#076E7A] hover:to-[#168E89] rounded-xl shadow-md shadow-[#087F8C]/20 transition"
          >
            <Plus size={15} />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-20 flex justify-center bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          No job openings found. Click "Post New Job" to create your first listing.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F8C] bg-[#DDF2F0] px-2.5 py-0.5 rounded-md">
                    {job.department}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      job.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : job.status === 'draft'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#16324F] mt-3 leading-snug">
                  {job.title}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Briefcase size={13} className="text-slate-400" />
                    <span>{job.job_type}</span>
                  </div>
                  {job.pay_range && (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <DollarSign size={13} />
                      <span>{job.pay_range}</span>
                    </div>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {new Date(job.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(job)}
                    className="p-1.5 text-slate-500 hover:text-[#087F8C] hover:bg-[#DDF2F0]/40 rounded-xl transition text-xs font-semibold flex items-center gap-1 px-2.5"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete job"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Job Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#16324F]">
                {editingJob ? 'Edit Career Opportunity' : 'Create Job Opportunity'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Critical Care Registered Nurse (ICU)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  >
                    <option value="Nursing">Nursing</option>
                    <option value="Allied Health">Allied Health</option>
                    <option value="Physical Therapy">Physical Therapy</option>
                    <option value="Occupational Therapy">Occupational Therapy</option>
                    <option value="Speech Therapy">Speech Therapy</option>
                    <option value="Healthcare Leadership">Healthcare Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Placement Type *</label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  >
                    <option value="Travel / Contract">Travel / Contract (13 Weeks)</option>
                    <option value="Per Diem / PRN">Per Diem / PRN Shifts</option>
                    <option value="Permanent Placement">Permanent Placement</option>
                    <option value="Contract-to-Hire">Contract-to-Hire</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Austin, TX or Remote / Nationwide"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pay / Compensation Rate</label>
                  <input
                    type="text"
                    value={formData.pay_range}
                    onChange={(e) => setFormData({ ...formData, pay_range: e.target.value })}
                    placeholder="e.g. $2,800 - $3,400 / wk or $48 - $60 / hr"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Position Overview *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of duties, clinical unit environment, and shift schedule..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Requirements & Qualifications</label>
                <textarea
                  rows={2}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="e.g. Current RN license, 2+ yrs ICU experience, BLS/ACLS certifications..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Benefits & Perks</label>
                <textarea
                  rows={2}
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="e.g. Housing stipend, 401(k) matching, day-one medical coverage, weekly direct deposit..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Publishing Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                >
                  <option value="published">Published (Visible on Careers Page)</option>
                  <option value="draft">Draft (Internal Only)</option>
                  <option value="closed">Closed (Fulfilled / Expired)</option>
                </select>
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
                  {editingJob ? 'Save Job Post' : 'Publish Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsView;
