import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Bot,
  MessageSquare,
  Users,
  CheckCircle2,
  Cpu,
  Coins,
  AlertTriangle,
  Calendar,
  RefreshCw,
  TrendingUp,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const AIAnalyticsView: React.FC = () => {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [range]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAIAnalytics(range);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const summary = data?.summary || {
    total_conversations: 0,
    total_ai_messages: 0,
    human_handovers: 0,
    ai_resolved: 0,
    input_tokens: 0,
    output_tokens: 0,
    total_tokens: 0,
    estimated_cost: 0,
    failure_count: 0,
  };

  const models = data?.models || [];
  const trends = data?.trends || [];
  const recentLogs = data?.recent_logs || [];

  const handoverRate = summary.total_conversations > 0
    ? ((summary.human_handovers / summary.total_conversations) * 100).toFixed(1)
    : '0.0';

  const resolutionRate = summary.total_conversations > 0
    ? (((summary.total_conversations - summary.human_handovers) / summary.total_conversations) * 100).toFixed(1)
    : '100.0';

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#087F8C] to-[#19A6A0] text-white flex items-center justify-center shadow-xs">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#16324F]">AI Usage & Performance Analytics</h2>
            <p className="text-xs text-slate-500">
              Live metrics on OpenRouter token consumption, model requests, human handovers, and resolution rates.
            </p>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d', 'all'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition uppercase ${
                range === r
                  ? 'bg-[#087F8C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? 'All Time' : `Last ${r}`}
            </button>
          ))}
          <button
            onClick={loadAnalytics}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
            title="Refresh analytics"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Conversations */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">AI Conversations</span>
            <div className="p-2 bg-[#DDF2F0] text-[#087F8C] rounded-xl">
              <MessageSquare size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-[#16324F]">{summary.total_conversations}</h3>
          <p className="text-[11px] text-slate-400">{summary.total_ai_messages} automated messages generated</p>
        </div>

        {/* Human Handover Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Human Handover Rate</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-[#16324F]">{handoverRate}%</h3>
          <p className="text-[11px] text-slate-400">{summary.human_handovers} conversations escalated to human</p>
        </div>

        {/* AI Self-Service Resolution */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">AI Automation Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-[#16324F]">{resolutionRate}%</h3>
          <p className="text-[11px] text-slate-400">Resolved autonomously without human agent</p>
        </div>

        {/* Token Consumption & Cost */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Tokens & Est. Cost</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Coins size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-[#16324F]">
            {summary.total_tokens > 1000 ? `${(summary.total_tokens / 1000).toFixed(1)}k` : summary.total_tokens}
          </h3>
          <p className="text-[11px] text-slate-400">
            Est. Cost: <strong className="text-slate-700">${Number(summary.estimated_cost).toFixed(4)}</strong>
          </p>
        </div>
      </div>

      {/* Model Breakdown & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-[#087F8C]" />
              <h4 className="font-bold text-sm text-[#16324F]">Model Distribution</h4>
            </div>
            <span className="text-xs text-slate-400">{models.length} active models</span>
          </div>

          {models.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No model usage records found in this time window.
            </div>
          ) : (
            <div className="space-y-3">
              {models.map((m: any, idx: number) => {
                const totalModelTokens = Number(m.tokens || 0);
                const pct = summary.total_ai_messages > 0
                  ? Math.round((m.calls / summary.total_ai_messages) * 100)
                  : 0;
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 font-mono truncate max-w-[280px]">
                        {m.model}
                      </span>
                      <span className="text-[#087F8C] font-extrabold">{m.calls} calls ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#087F8C] h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Tokens consumed: {totalModelTokens.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Daily Request Activity Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#087F8C]" />
              <h4 className="font-bold text-sm text-[#16324F]">Daily Request Activity</h4>
            </div>
            <span className="text-xs text-slate-400">Past {range.toUpperCase()}</span>
          </div>

          {trends.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Activity data will chart here as visitor inquiries occur.
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <div className="h-44 flex items-end gap-2 border-b border-slate-100 pb-2">
                {trends.map((t: any, idx: number) => {
                  const maxRequests = Math.max(...trends.map((x: any) => x.requests), 5);
                  const heightPct = Math.max(10, Math.round((t.requests / maxRequests) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className="w-full bg-[#087F8C] hover:bg-[#19A6A0] rounded-t-lg transition-all"
                        style={{ height: `${heightPct}%` }}
                        title={`${t.date}: ${t.requests} requests (${t.tokens} tokens)`}
                      />
                      <span className="text-[9px] text-slate-400 rotate-45 origin-left mt-1 whitespace-nowrap">
                        {new Date(t.date).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent AI Invocation Logs Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#087F8C]" />
            <h4 className="font-bold text-sm text-[#16324F]">Recent AI Generation Audit Logs</h4>
          </div>
          <span className="text-xs text-slate-400">Latest 15 calls</span>
        </div>

        {recentLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No invocation logs recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-2">
                <tr>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Conversation</th>
                  <th className="pb-2">Model Used</th>
                  <th className="pb-2">Tokens</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 text-slate-400 text-[11px]">
                      {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-[#087F8C]">
                      {log.conversation_id.slice(0, 8)}...
                    </td>
                    <td className="py-2.5 font-mono text-[11px]">
                      {log.model}
                    </td>
                    <td className="py-2.5 text-[11px]">
                      {(log.input_tokens + log.output_tokens).toLocaleString()}
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.response_status === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.response_status === 'fallback_used'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.response_status}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-[11px]">
                      ${Number(log.estimated_cost).toFixed(5)}
                    </td>
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

export default AIAnalyticsView;
