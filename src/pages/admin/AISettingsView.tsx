import React, { useState, useEffect } from 'react';
import {
  Bot,
  Key,
  Cpu,
  Zap,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  Server,
  Activity,
  ShieldAlert,
  Sparkles,
  Info,
  Clock,
  Database,
  Search,
  ExternalLink
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const AISettingsView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);

  // Settings state
  const [enabled, setEnabled] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [maskedApiKey, setMaskedApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [defaultModel, setDefaultModel] = useState('meta-llama/llama-3.3-70b-instruct');
  const [fallbackModel, setFallbackModel] = useState('google/gemini-2.0-flash-001');
  const [apiBaseUrl, setApiBaseUrl] = useState('https://openrouter.ai/api/v1');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [contextLimit, setContextLimit] = useState(10);
  const [timeoutSeconds, setTimeoutSeconds] = useState(30);
  const [settingsVersion, setSettingsVersion] = useState(1);

  // Connection test state
  const [connectionStatus, setConnectionStatus] = useState<string>('not_configured');
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  // Behaviours state
  const [behaviours, setBehaviours] = useState({
    enable_ai_responses: true,
    enable_ai_when_agents_offline: true,
    enable_ai_when_agents_busy: true,
    enable_ai_first_response: true,
    enable_human_takeover: true,
    enable_conversation_memory: true,
    enable_streaming_responses: true,
    enable_general_knowledge: true,
    enable_website_knowledge: true,
    enable_mysql_retrieval: true,
    ai_assistant_name: 'Valora AI Virtual Assistant',
    ai_welcome_message: 'Hello! Welcome to Valora Healthcare. I am your virtual assistant. How can I help you today?',
  });

  // Available models list
  const [availableModels, setAvailableModels] = useState<Array<{ id: string; name: string; context_length: number }>>([]);
  const [modelSearch, setModelSearch] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
    loadModels();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAISettings();
      const s = data.settings;
      setEnabled(Boolean(s.enabled));
      setMaskedApiKey(s.masked_api_key || '');
      setDefaultModel(s.default_model || 'meta-llama/llama-3.3-70b-instruct');
      setFallbackModel(s.fallback_model || 'google/gemini-2.0-flash-001');
      setApiBaseUrl(s.api_base_url || 'https://openrouter.ai/api/v1');
      setSystemPrompt(s.system_prompt || '');
      setTemperature(s.temperature ?? 0.7);
      setMaxTokens(s.max_tokens ?? 1024);
      setContextLimit(s.context_limit ?? 10);
      setTimeoutSeconds(s.timeout_seconds ?? 30);
      setConnectionStatus(s.connection_status || 'not_configured');
      setLastTestedAt(s.last_tested_at || null);
      setSettingsVersion(s.settings_version || 1);

      if (data.behaviours) {
        setBehaviours(data.behaviours);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadModels = async () => {
    try {
      setModelsLoading(true);
      const list = await adminApi.getOpenRouterModels();
      setAvailableModels(list);
    } catch (err) {
      console.error(err);
    } finally {
      setModelsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      const res = await adminApi.testOpenRouterConnection({
        api_key: apiKeyInput.trim() || undefined,
        model_id: defaultModel,
        api_base_url: apiBaseUrl,
      });
      setTestResult(res);
      setConnectionStatus(res.status);
      setLastTestedAt(new Date().toISOString());
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed',
      });
      setConnectionStatus('error');
    } finally {
      setTesting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccessMsg(null);

      const payload: any = {
        enabled,
        default_model: defaultModel,
        fallback_model: fallbackModel,
        api_base_url: apiBaseUrl,
        system_prompt: systemPrompt,
        temperature,
        max_tokens: maxTokens,
        context_limit: contextLimit,
        timeout_seconds: timeoutSeconds,
        behaviours,
      };

      if (apiKeyInput.trim()) {
        payload.api_key = apiKeyInput.trim();
      }

      const res = await adminApi.updateAISettings(payload);
      setSettingsVersion(res.data.settings.settings_version);
      setMaskedApiKey(res.data.settings.masked_api_key || '');
      setApiKeyInput('');
      setSaveSuccessMsg('AI settings saved successfully! Runtime cache invalidated — changes took effect immediately.');
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const filteredModels = availableModels.filter(
    (m) =>
      m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(modelSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16">
        <div className="w-8 h-8 border-3 border-[#087F8C] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-semibold mt-3">Loading OpenRouter AI configuration...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 max-w-6xl">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#087F8C] to-[#19A6A0] text-white flex items-center justify-center shadow-xs">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#16324F] flex items-center gap-2">
                <span>OpenRouter AI Configuration</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  v{settingsVersion}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Configure your OpenRouter LLM, model catalogue, retrieval parameters, and instant hot-reloading.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {testing ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap size={14} className="text-amber-500" />
            )}
            <span>Test Connection</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-[#087F8C] hover:bg-[#076E7A] text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Connection Test Status Banner */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${
            testResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-bold">{testResult.success ? 'Connection Verified' : 'Connection Failed'}</p>
            <p className="font-normal mt-0.5">{testResult.message}</p>
          </div>
        </div>
      )}

      {/* Grid: OpenRouter Credentials & Model Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): OpenRouter API & Models */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main API Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-[#087F8C]" />
                <h3 className="font-bold text-sm text-[#16324F]">OpenRouter API Credentials</h3>
              </div>
              {/* Enable AI Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-semibold text-slate-700">Enable AI Assistant</span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087F8C]" />
              </label>
            </div>

            {/* API Key Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">OpenRouter API Key</label>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#087F8C] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Get API Key</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder={maskedApiKey ? `Current: ${maskedApiKey}` : 'sk-or-v1-...'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Encrypted at rest using AES-256-GCM. Never exposed to browser clients or logs.
              </p>
            </div>

            {/* API Base URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">API Base Endpoint</label>
              <input
                type="text"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                placeholder="https://openrouter.ai/api/v1"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:bg-white font-mono"
              />
            </div>

            {/* Connection Status Row */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Connection Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    connectionStatus === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : connectionStatus === 'invalid_key' || connectionStatus === 'error'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {connectionStatus.replace('_', ' ')}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {lastTestedAt ? `Last tested: ${new Date(lastTestedAt).toLocaleTimeString()}` : 'Not tested yet'}
              </span>
            </div>
          </div>

          {/* Model Selection Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-[#087F8C]" />
                <h3 className="font-bold text-sm text-[#16324F]">Dynamic Model Selection</h3>
              </div>
              <button
                type="button"
                onClick={loadModels}
                disabled={modelsLoading}
                className="text-[11px] text-[#087F8C] hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
              >
                <RefreshCw size={12} className={modelsLoading ? 'animate-spin' : ''} />
                <span>Refresh Catalogue</span>
              </button>
            </div>

            {/* Model Search Filter */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search models (e.g. llama-3.3, claude, gemini, gpt-4o, deepseek)..."
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
              />
            </div>

            {/* Default Primary Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Primary AI Model</label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#087F8C] font-semibold text-slate-800"
              >
                {filteredModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Selected ID: <code className="text-[#087F8C] font-mono">{defaultModel}</code>
              </p>
            </div>

            {/* Backup Fallback Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Backup / Fallback AI Model</label>
              <select
                value={fallbackModel}
                onChange={(e) => setFallbackModel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#087F8C] font-semibold text-slate-800"
              >
                <option value="">None (Disable automatic fallback)</option>
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                If the primary model experiences rate limits or downtime, OpenRouter requests automatically route to this backup model.
              </p>
            </div>
          </div>

          {/* System Instructions & Persona Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles size={18} className="text-[#087F8C]" />
              <h3 className="font-bold text-sm text-[#16324F]">AI Persona & System Prompt</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Assistant Display Name</label>
                <input
                  type="text"
                  value={behaviours.ai_assistant_name}
                  onChange={(e) => setBehaviours({ ...behaviours, ai_assistant_name: e.target.value })}
                  placeholder="Valora AI Clinical Assistant"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Welcome Message</label>
                <input
                  type="text"
                  value={behaviours.ai_welcome_message}
                  onChange={(e) => setBehaviours({ ...behaviours, ai_welcome_message: e.target.value })}
                  placeholder="Hello! Welcome to Valora Healthcare..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">System Instructions</label>
              <textarea
                rows={7}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter system prompt instructions..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:bg-white"
              />
              <p className="text-[11px] text-slate-400">
                The AI automatically injects retrieved website knowledge, published jobs, and official contact phone numbers alongside these system instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Behaviour Toggles & Tuning Parameters */}
        <div className="space-y-6">
          {/* AI Behaviour Controls */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders size={18} className="text-[#087F8C]" />
              <h3 className="font-bold text-sm text-[#16324F]">AI Behaviour Controls</h3>
            </div>

            <div className="space-y-3">
              {[
                { key: 'enable_ai_responses', label: 'Enable AI Responses', desc: 'Allows AI to reply to incoming visitor queries' },
                { key: 'enable_ai_when_agents_offline', label: 'AI When Agents Offline', desc: 'Auto-handles chats when no human agents are active' },
                { key: 'enable_ai_when_agents_busy', label: 'AI When Agents Busy', desc: 'Assists visitors when all agents are occupied' },
                { key: 'enable_ai_first_response', label: 'AI First Response', desc: 'Provides immediate automated clinical greeting' },
                { key: 'enable_human_takeover', label: 'Allow Human Handover', desc: 'Provides "Talk to a Human" option to visitors' },
                { key: 'enable_conversation_memory', label: 'Conversation Memory', desc: 'Maintains past message context across session' },
                { key: 'enable_streaming_responses', label: 'Streaming Tokens', desc: 'Streams response in real-time over WebSocket' },
                { key: 'enable_general_knowledge', label: 'General Knowledge', desc: 'Answers general questions (e.g. RN vs LPN difference)' },
                { key: 'enable_website_knowledge', label: 'Website Knowledge Retrieval', desc: 'Injects official Valora website service details' },
                { key: 'enable_mysql_retrieval', label: 'MySQL Jobs Retrieval', desc: 'Queries real-time published positions from DB' },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-start justify-between gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{label}</p>
                    <p className="text-[10px] text-slate-400">{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(behaviours as any)[key]}
                    onChange={(e) => setBehaviours({ ...behaviours, [key]: e.target.checked })}
                    className="w-4 h-4 rounded text-[#087F8C] focus:ring-[#087F8C] mt-0.5"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Model Hyperparameters Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Activity size={18} className="text-[#087F8C]" />
              <h3 className="font-bold text-sm text-[#16324F]">Hyperparameters</h3>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Temperature</span>
                <span className="font-mono text-[#087F8C] font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#087F8C]"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.0 (Factual)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Max Tokens per Response</label>
              <input
                type="number"
                min="128"
                max="4096"
                step="64"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#087F8C]"
              />
            </div>

            {/* Context Limit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Conversation Context Limit</label>
              <input
                type="number"
                min="2"
                max="25"
                value={contextLimit}
                onChange={(e) => setContextLimit(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#087F8C]"
              />
              <p className="text-[10px] text-slate-400">Number of recent messages passed to OpenRouter.</p>
            </div>

            {/* Timeout Seconds */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Response Timeout (seconds)</label>
              <input
                type="number"
                min="5"
                max="60"
                value={timeoutSeconds}
                onChange={(e) => setTimeoutSeconds(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#087F8C]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AISettingsView;
