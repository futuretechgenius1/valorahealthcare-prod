import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, User, Phone, Mail, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const stages = [
  { id: 'new', label: '1. New Talent', color: 'bg-amber-500' },
  { id: 'screening', label: '2. Clinical Screening', color: 'bg-blue-500' },
  { id: 'interviewing', label: '3. Facility Interview', color: 'bg-purple-500' },
  { id: 'placed', label: '4. Placed & Active', color: 'bg-emerald-500' },
];

export const RecruitmentPipelineView: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPipeline = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCandidates();
      setCandidates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, []);

  const moveCandidate = async (candidateId: number, nextStage: string) => {
    try {
      await adminApi.updateCandidate(candidateId, { status: nextStage });
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, status: nextStage } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#16324F]">Recruitment Pipeline</h2>
          <p className="text-xs text-slate-500">
            Interactive clinical placement lifecycle from talent acquisition to hospital deployment
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const stageCandidates = candidates.filter(
              (c) => c.status === stage.id || (stage.id === 'new' && !c.status)
            );

            return (
              <div
                key={stage.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-4 flex flex-col min-h-[500px] shadow-xs"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                    <h3 className="text-xs font-bold text-[#16324F]">{stage.label}</h3>
                  </div>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards */}
                <div className="mt-3 flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageCandidates.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs italic">
                      No candidates in this stage
                    </div>
                  ) : (
                    stageCandidates.map((c) => (
                      <div
                        key={c.id}
                        className="bg-slate-50 hover:bg-[#DDF2F0]/20 p-3.5 rounded-2xl border border-slate-200/70 transition space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-xs text-slate-900">
                              {c.first_name} {c.last_name}
                            </p>
                            <p className="text-[11px] font-semibold text-[#087F8C]">
                              {c.profession}
                            </p>
                          </div>
                          <span className="text-[10px] font-medium bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                            {c.specialty || 'General'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          <p>Exp: {c.experience_years || 'Experienced'}</p>
                          <p>State: {c.license_state || 'Verified'}</p>
                        </div>

                        {/* Stage Progression Buttons */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-1">
                          {stage.id !== 'new' && (
                            <button
                              onClick={() => {
                                const currentIndex = stages.findIndex((s) => s.id === stage.id);
                                if (currentIndex > 0) moveCandidate(c.id, stages[currentIndex - 1].id);
                              }}
                              className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold"
                            >
                              ← Back
                            </button>
                          )}
                          <div className="flex-1" />
                          {stage.id !== 'placed' && (
                            <button
                              onClick={() => {
                                const currentIndex = stages.findIndex((s) => s.id === stage.id);
                                if (currentIndex < stages.length - 1)
                                  moveCandidate(c.id, stages[currentIndex + 1].id);
                              }}
                              className="text-[10px] font-bold text-[#087F8C] hover:text-[#076E7A] bg-white px-2 py-1 rounded-md shadow-xs border border-slate-200 flex items-center gap-1"
                            >
                              <span>Next Stage</span>
                              <ArrowRight size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruitmentPipelineView;
