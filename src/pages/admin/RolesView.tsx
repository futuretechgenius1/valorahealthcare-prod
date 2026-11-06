import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Lock } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const modulesList = [
  { key: 'dashboard', label: 'Executive Analytics & KPIs' },
  { key: 'enquiries', label: 'Enquiries & General Contacts' },
  { key: 'employers', label: 'Healthcare Facilities Directory' },
  { key: 'candidates', label: 'Clinical Talent Pool' },
  { key: 'staffing_requests', label: 'Facility Staffing Orders' },
  { key: 'jobs', label: 'Job Postings Management' },
  { key: 'applications', label: 'Candidate Applications' },
  { key: 'chat', label: 'Real-Time Live Chat' },
  { key: 'users', label: 'Admin Users & Roles' },
  { key: 'settings', label: 'System Configuration' },
];

export const RolesView: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await adminApi.getRoles();
        setRoles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#16324F]">Roles & Permissions Matrix</h2>
          <p className="text-xs text-slate-500">
            Role-Based Access Control (RBAC) governance for clinical administrators and recruiters
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Functional Module
                  </th>
                  {roles.map((r) => (
                    <th key={r.id} className="py-3 px-4 text-center font-bold text-[#16324F]">
                      <span className="text-sm font-extrabold">{r.name}</span>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">{r.description}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modulesList.map((mod) => (
                  <tr key={mod.key} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-semibold text-slate-800">{mod.label}</td>
                    {roles.map((r) => {
                      const perms = Array.isArray(r.permissions)
                        ? r.permissions
                        : typeof r.permissions === 'string'
                        ? JSON.parse(r.permissions || '[]')
                        : [];
                      const hasAccess = perms.includes('all') || perms.includes(mod.key);

                      return (
                        <td key={r.id} className="py-3 px-4 text-center">
                          {hasAccess ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                              <Check size={14} />
                            </span>
                          ) : (
                            <span className="inline-block w-2 h-0.5 bg-slate-300 rounded-full" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesView;
