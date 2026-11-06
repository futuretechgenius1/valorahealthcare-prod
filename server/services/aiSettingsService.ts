import { pool } from '../db';
import { encryptApiKey, decryptApiKey, maskApiKey } from './cryptoService';

export interface AISettings {
  id: number;
  provider: string;
  default_model: string;
  fallback_model: string;
  api_base_url: string;
  system_prompt: string;
  temperature: number;
  max_tokens: number;
  context_limit: number;
  timeout_seconds: number;
  enabled: boolean;
  connection_status: string;
  last_tested_at: string | null;
  last_test_error: string | null;
  settings_version: number;
  updated_at: string;
  // Masked or decrypted key handling
  has_api_key: boolean;
  masked_api_key?: string;
  decrypted_api_key?: string;
}

export interface AIBehaviours {
  enable_ai_responses: boolean;
  enable_ai_when_agents_offline: boolean;
  enable_ai_when_agents_busy: boolean;
  enable_ai_first_response: boolean;
  enable_human_takeover: boolean;
  enable_conversation_memory: boolean;
  enable_streaming_responses: boolean;
  enable_general_knowledge: boolean;
  enable_website_knowledge: boolean;
  enable_mysql_retrieval: boolean;
  ai_assistant_name: string;
  ai_welcome_message: string;
}

// In-memory runtime cache
let cachedAISettings: AISettings | null = null;
let cachedBehaviours: AIBehaviours | null = null;
let currentSettingsVersion = 1;

export function invalidateAISettingsCache() {
  cachedAISettings = null;
  cachedBehaviours = null;
  console.log('[AISettingsService] Runtime cache invalidated. Next request will fetch fresh settings.');
}

/**
 * Load full settings including decrypted API key for internal server use only
 */
export async function getRuntimeAISettings(): Promise<{ settings: AISettings; behaviours: AIBehaviours }> {
  if (cachedAISettings && cachedBehaviours) {
    return { settings: cachedAISettings, behaviours: cachedBehaviours };
  }

  const [settingsRows] = await pool.query('SELECT * FROM ai_settings ORDER BY id ASC LIMIT 1') as any;
  const raw = settingsRows?.[0] || {};

  const decryptedKey = raw.encrypted_api_key ? decryptApiKey(raw.encrypted_api_key) : '';

  const settings: AISettings = {
    id: raw.id || 1,
    provider: raw.provider || 'openrouter',
    default_model: raw.default_model || 'meta-llama/llama-3.3-70b-instruct',
    fallback_model: raw.fallback_model || 'google/gemini-2.0-flash-001',
    api_base_url: raw.api_base_url || 'https://openrouter.ai/api/v1',
    system_prompt: raw.system_prompt || '',
    temperature: typeof raw.temperature === 'number' ? raw.temperature : parseFloat(raw.temperature) || 0.7,
    max_tokens: raw.max_tokens || 1024,
    context_limit: raw.context_limit || 10,
    timeout_seconds: raw.timeout_seconds || 30,
    enabled: Boolean(raw.enabled),
    connection_status: raw.connection_status || 'not_configured',
    last_tested_at: raw.last_tested_at || null,
    last_test_error: raw.last_test_error || null,
    settings_version: raw.settings_version || 1,
    updated_at: raw.updated_at || new Date().toISOString(),
    has_api_key: Boolean(decryptedKey),
    decrypted_api_key: decryptedKey,
  };

  const [behaviourRows] = await pool.query('SELECT setting_key, setting_value FROM ai_behaviour_settings') as any;
  const bMap: Record<string, string> = {};
  for (const r of behaviourRows || []) {
    bMap[r.setting_key] = r.setting_value;
  }

  const behaviours: AIBehaviours = {
    enable_ai_responses: bMap['enable_ai_responses'] !== 'false',
    enable_ai_when_agents_offline: bMap['enable_ai_when_agents_offline'] !== 'false',
    enable_ai_when_agents_busy: bMap['enable_ai_when_agents_busy'] !== 'false',
    enable_ai_first_response: bMap['enable_ai_first_response'] !== 'false',
    enable_human_takeover: bMap['enable_human_takeover'] !== 'false',
    enable_conversation_memory: bMap['enable_conversation_memory'] !== 'false',
    enable_streaming_responses: bMap['enable_streaming_responses'] !== 'false',
    enable_general_knowledge: bMap['enable_general_knowledge'] !== 'false',
    enable_website_knowledge: bMap['enable_website_knowledge'] !== 'false',
    enable_mysql_retrieval: bMap['enable_mysql_retrieval'] !== 'false',
    ai_assistant_name: bMap['ai_assistant_name'] || 'Valora AI Clinical Assistant',
    ai_welcome_message: bMap['ai_welcome_message'] || 'Hello! Welcome to Valora Healthcare. I am your virtual assistant. How can I help you today?',
  };

  cachedAISettings = settings;
  cachedBehaviours = behaviours;
  currentSettingsVersion = settings.settings_version;

  return { settings, behaviours };
}

/**
 * Return sanitized settings safe for frontend admin response (API key is strictly masked)
 */
export async function getSafeAISettings(): Promise<{ settings: Omit<AISettings, 'decrypted_api_key'>; behaviours: AIBehaviours }> {
  const { settings, behaviours } = await getRuntimeAISettings();
  const maskedKey = settings.decrypted_api_key ? maskApiKey(settings.decrypted_api_key) : '';

  const { decrypted_api_key, ...safeSettings } = settings;
  return {
    settings: {
      ...safeSettings,
      masked_api_key: maskedKey,
    },
    behaviours,
  };
}

/**
 * Update AI settings and behaviour controls dynamically
 */
export async function updateAISettings(
  payload: {
    api_key?: string;
    default_model?: string;
    fallback_model?: string;
    api_base_url?: string;
    system_prompt?: string;
    temperature?: number;
    max_tokens?: number;
    context_limit?: number;
    timeout_seconds?: number;
    enabled?: boolean;
    behaviours?: Partial<AIBehaviours>;
  },
  adminUser?: { id: number; name: string }
) {
  const current = (await getRuntimeAISettings()).settings;
  const newVersion = (current.settings_version || 1) + 1;
  const changedFields: Record<string, any> = {};

  let encryptedKeyToSave = undefined;
  if (payload.api_key && payload.api_key.trim()) {
    const rawKey = payload.api_key.trim();
    // Only update if it's not the masked value
    if (!rawKey.includes('••••')) {
      encryptedKeyToSave = encryptApiKey(rawKey);
      changedFields.api_key = 'Updated API Key';
    }
  }

  if (payload.default_model !== undefined) changedFields.default_model = payload.default_model;
  if (payload.fallback_model !== undefined) changedFields.fallback_model = payload.fallback_model;
  if (payload.api_base_url !== undefined) changedFields.api_base_url = payload.api_base_url;
  if (payload.system_prompt !== undefined) changedFields.system_prompt = payload.system_prompt;
  if (payload.temperature !== undefined) changedFields.temperature = payload.temperature;
  if (payload.max_tokens !== undefined) changedFields.max_tokens = payload.max_tokens;
  if (payload.context_limit !== undefined) changedFields.context_limit = payload.context_limit;
  if (payload.timeout_seconds !== undefined) changedFields.timeout_seconds = payload.timeout_seconds;
  if (payload.enabled !== undefined) changedFields.enabled = payload.enabled;

  await pool.query(
    `UPDATE ai_settings 
     SET encrypted_api_key = COALESCE(?, encrypted_api_key),
         default_model = COALESCE(?, default_model),
         fallback_model = COALESCE(?, fallback_model),
         api_base_url = COALESCE(?, api_base_url),
         system_prompt = COALESCE(?, system_prompt),
         temperature = COALESCE(?, temperature),
         max_tokens = COALESCE(?, max_tokens),
         context_limit = COALESCE(?, context_limit),
         timeout_seconds = COALESCE(?, timeout_seconds),
         enabled = COALESCE(?, enabled),
         settings_version = ?,
         updated_at = NOW()
     WHERE id = ?`,
    [
      encryptedKeyToSave,
      payload.default_model,
      payload.fallback_model,
      payload.api_base_url,
      payload.system_prompt,
      payload.temperature,
      payload.max_tokens,
      payload.context_limit,
      payload.timeout_seconds,
      payload.enabled !== undefined ? (payload.enabled ? 1 : 0) : null,
      newVersion,
      current.id,
    ]
  );

  // Update behaviour key-value pairs
  if (payload.behaviours) {
    for (const [key, value] of Object.entries(payload.behaviours)) {
      if (value !== undefined) {
        await pool.query(
          `INSERT INTO ai_behaviour_settings (setting_key, setting_value) 
           VALUES (?, ?) 
           ON DUPLICATE KEY UPDATE setting_value = ?`,
          [key, String(value), String(value)]
        );
        changedFields[key] = value;
      }
    }
  }

  // Record audit log
  if (adminUser) {
    await pool.query(
      `INSERT INTO ai_configuration_audit (admin_user_id, admin_name, action, changed_fields)
       VALUES (?, ?, 'Update AI Configuration', ?)`,
      [adminUser.id, adminUser.name, JSON.stringify(changedFields)]
    );
  }

  // Instant cache invalidation
  invalidateAISettingsCache();

  return await getSafeAISettings();
}

/**
 * Test OpenRouter API connection with configured or incoming key and model
 */
export async function testOpenRouterConnection(apiKey?: string, modelId?: string, baseUrl?: string): Promise<{
  success: boolean;
  status: 'connected' | 'invalid_key' | 'model_unavailable' | 'insufficient_credits' | 'rate_limited' | 'error';
  message: string;
  latencyMs: number;
  modelTested: string;
}> {
  const current = (await getRuntimeAISettings()).settings;
  const keyToUse = (apiKey && !apiKey.includes('••••')) ? apiKey.trim() : current.decrypted_api_key;
  const modelToUse = modelId || current.default_model || 'meta-llama/llama-3.3-70b-instruct';
  const urlToUse = baseUrl || current.api_base_url || 'https://openrouter.ai/api/v1';

  if (!keyToUse) {
    return {
      success: false,
      status: 'invalid_key',
      message: 'No OpenRouter API key configured. Please enter a valid API key.',
      latencyMs: 0,
      modelTested: modelToUse,
    };
  }

  const endpoint = `${urlToUse.replace(/\/$/, '')}/chat/completions`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keyToUse}`,
        'HTTP-Referer': 'https://valorahealthcare.com',
        'X-Title': 'Valora Healthcare Live Chat Test',
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [{ role: 'user', content: 'Reply with the word OK.' }],
        max_tokens: 5,
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    const data = await response.json().catch(() => ({}));

    if (response.ok && data.choices && data.choices.length > 0) {
      // Success! Update connection status in DB
      await pool.query(
        `UPDATE ai_settings 
         SET connection_status = 'connected', last_tested_at = NOW(), last_test_error = NULL 
         WHERE id = ?`,
        [current.id]
      );
      invalidateAISettingsCache();

      return {
        success: true,
        status: 'connected',
        message: `Successfully connected to OpenRouter using ${modelToUse} (${latencyMs}ms response time).`,
        latencyMs,
        modelTested: modelToUse,
      };
    }

    // Handle OpenRouter-specific errors
    const errorMsg = data?.error?.message || response.statusText || 'Unknown error';
    let status: 'invalid_key' | 'model_unavailable' | 'insufficient_credits' | 'rate_limited' | 'error' = 'error';

    if (response.status === 401 || errorMsg.toLowerCase().includes('api key') || errorMsg.toLowerCase().includes('unauthorized')) {
      status = 'invalid_key';
    } else if (response.status === 402 || errorMsg.toLowerCase().includes('credit') || errorMsg.toLowerCase().includes('balance')) {
      status = 'insufficient_credits';
    } else if (response.status === 429 || errorMsg.toLowerCase().includes('rate limit')) {
      status = 'rate_limited';
    } else if (response.status === 404 || errorMsg.toLowerCase().includes('model not found') || errorMsg.toLowerCase().includes('unavailable')) {
      status = 'model_unavailable';
    }

    await pool.query(
      `UPDATE ai_settings 
       SET connection_status = ?, last_tested_at = NOW(), last_test_error = ? 
       WHERE id = ?`,
      [status, errorMsg, current.id]
    );
    invalidateAISettingsCache();

    return {
      success: false,
      status,
      message: `OpenRouter test failed (${response.status}): ${errorMsg}`,
      latencyMs,
      modelTested: modelToUse,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    const errMsg = err.name === 'AbortError' ? 'Connection timed out after 15 seconds' : err.message || 'Network error';

    await pool.query(
      `UPDATE ai_settings 
       SET connection_status = 'error', last_tested_at = NOW(), last_test_error = ? 
       WHERE id = ?`,
      [errMsg, current.id]
    );
    invalidateAISettingsCache();

    return {
      success: false,
      status: 'error',
      message: `Connection failed: ${errMsg}`,
      latencyMs,
      modelTested: modelToUse,
    };
  }
}

/**
 * Fetch available models from OpenRouter API
 */
export async function fetchOpenRouterModels(apiKey?: string): Promise<Array<{ id: string; name: string; context_length: number; description?: string }>> {
  const current = (await getRuntimeAISettings()).settings;
  const keyToUse = apiKey || current.decrypted_api_key;
  const baseUrl = current.api_base_url || 'https://openrouter.ai/api/v1';

  try {
    const headers: Record<string, string> = {};
    if (keyToUse) {
      headers['Authorization'] = `Bearer ${keyToUse}`;
    }

    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/models`, {
      headers,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch models: ${res.statusText}`);
    }

    const data = await res.json();
    const models = (data.data || []).map((m: any) => ({
      id: m.id,
      name: m.name || m.id,
      context_length: m.context_length || 8192,
      description: m.description ? m.description.slice(0, 120) : '',
    }));

    return models;
  } catch (err) {
    console.error('[AISettingsService] Error fetching models from OpenRouter:', err);
    // Return curated high-performance fallback models list
    return [
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Meta: Llama 3.3 70B Instruct (Free/Low-cost)', context_length: 131072 },
      { id: 'google/gemini-2.0-flash-001', name: 'Google: Gemini 2.0 Flash', context_length: 1048576 },
      { id: 'anthropic/claude-3.5-haiku', name: 'Anthropic: Claude 3.5 Haiku', context_length: 200000 },
      { id: 'openai/gpt-4o-mini', name: 'OpenAI: GPT-4o Mini', context_length: 128000 },
      { id: 'deepseek/deepseek-chat', name: 'DeepSeek: DeepSeek V3', context_length: 64000 },
      { id: 'mistralai/mistral-small-24b-instruct-2501', name: 'Mistral: Mistral Small 24B', context_length: 32768 },
      { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen: Qwen 2.5 72B Instruct', context_length: 32768 },
    ];
  }
}
