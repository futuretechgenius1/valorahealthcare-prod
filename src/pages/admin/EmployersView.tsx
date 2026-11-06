import React, { useState, useEffect } from 'react';
import { Building2, Search, Plus, Edit2, Trash2, X, Phone, Mail, MapPin } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const EmployersView: React.FC = () => {
  const [employers, setEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingEmployer, setEditingEmployer] = useState<any | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    organization_name: '',
    contact_name: '',
    email: '',
    phone: '',
    facility_type: 'Hospital',
    location: '',
    status: 'lead',
    notes: '',
  });

  const loadEmployers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getEmployers({ status: statusFilter, search });
      setEmployers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadEmployers();
  };

  const openCreateModal = () => {
    setEditingEmployer(null);
    setFormData({
      organization_name: '',
      contact_name: '',
      email: '',
      phone: '',
      facility_type: 'Hospital',
      location: '',
      status: 'lead',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (emp: any) => {
    setEditingEmployer(emp);
    setFormData({
      organization_name: emp.organization_name,
      contact_name: emp.contact_name,
      email: emp.email,
      phone: emp.phone,
      facility_type: emp.facility_type || 'Hospital',
      location: emp.location || '',
      status: emp.status || 'lead',
      notes: emp.notes || '',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployer) {
        await adminApi.updateEmployer(editingEmployer.id, formData);
      } else {
        await adminApi.createEmployer(formData);
      }
      setModalOpen(false);
      loadEmployers();
    } catch (err: any) {
      alert(err.message || 'Error saving healthcare facility');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this healthcare facility?')) return;
    try {
      await adminApi.deleteEmployer(id);
      loadEmployers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#16324F]">Healthcare Facility Partners</h2>
          <p className="text-xs text-slate-500">Hospitals, medical networks, and clinical organizations partnering with Valora</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search facilities..."
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
            <option value="all">All Partnerships</option>
            <option value="lead">Prospective Lead</option>
            <option value="active">Active Client</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#087F8C] to-[#19A6A0] hover:from-[#076E7A] hover:to-[#168E89] rounded-xl shadow-md shadow-[#087F8C]/20 transition"
          >
            <Plus size={15} />
            <span>Add Facility</span>
          </button>
        </div>
      </div>

      {/* Grid Cards of Facilities */}
      {loading ? (
        <div className="py-20 flex justify-center bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin" />
        </div>
      ) : employers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          No healthcare facility partners found. Click "Add Facility" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {employers.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center font-bold">
                    <Building2 size={20} />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      emp.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : emp.status === 'lead'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {emp.status?.toUpperCase()}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-base text-[#16324F] leading-snug">
                    {emp.organization_name}
                  </h3>
                  <p className="text-xs font-medium text-[#087F8C] mt-0.5">
                    {emp.facility_type || 'Hospital'}
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">Lead Contact:</span>
                    <span>{emp.contact_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail size={13} className="text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={13} className="text-slate-400" />
                    <span>{emp.phone}</span>
                  </div>
                  {emp.location && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{emp.location}</span>
                    </div>
                  )}
                </div>

                {emp.notes && (
                  <p className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl line-clamp-2">
                    {emp.notes}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(emp)}
                  className="p-1.5 text-slate-500 hover:text-[#087F8C] hover:bg-[#DDF2F0]/40 rounded-xl transition text-xs font-semibold flex items-center gap-1 px-2.5"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Remove facility"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Facility Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#16324F]">
                {editingEmployer ? 'Edit Healthcare Facility' : 'Add New Healthcare Facility'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Facility Name *</label>
                <input
                  type="text"
                  required
                  value={formData.organization_name}
                  onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                  placeholder="e.g. Memorial Regional Medical Center"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Key Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Facility Type</label>
                  <select
                    value={formData.facility_type}
                    onChange={(e) => setFormData({ ...formData, facility_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  >
                    <option value="Hospital">Hospital / Acute Care</option>
                    <option value="Outpatient Clinic">Outpatient Clinic</option>
                    <option value="Surgical Center">Ambulatory Surgery Center</option>
                    <option value="Rehabilitation Facility">Rehabilitation Hospital</option>
                    <option value="Long-Term Care">Long-Term Care / SNF</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staffing@hospital.org"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 012-3456"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City, State / Region</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Austin, TX"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Partnership Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                  >
                    <option value="lead">Prospective Lead</option>
                    <option value="active">Active Client</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Billing terms, credentialing preferences, or coordinator notes..."
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
                  {editingEmployer ? 'Save Changes' : 'Create Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployersView;
