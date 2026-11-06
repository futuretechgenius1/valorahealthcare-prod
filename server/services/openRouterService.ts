import crypto from 'crypto';
import { pool } from '../db';
import { getRuntimeAISettings } from './aiSettingsService';
import { retrieveRelevantContext } from './knowledgeRetrievalService';
import { getAgentPresenceSummary } from './presenceService';

interface ChatHistoryMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GenerateAIResponseOptions {
  conversationId: string;
  visitorMessage: string;
  visitorName?: string;
  onChunk?: (chunk: string, fullText: string) => void;
}

interface GenerateAIResponseResult {
  messageId: string;
  replyText: string;
  modelUsed: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  fallbackUsed: boolean;
  status: 'success' | 'fallback_used' | 'error';
  error?: string;
}

/**
 * Determine whether AI should handle the incoming conversation
 */
export async function shouldAIRespond(conversationId: string): Promise<{ shouldRespond: boolean; reason: string }> {
  const { settings, behaviours } = await getRuntimeAISettings();

  if (!settings.enabled || !behaviours.enable_ai_responses) {
    return { shouldRespond: false, reason: 'AI responses are disabled in settings' };
  }

  // Check conversation mode in MySQL
  const [convRows] = await pool.query('SELECT mode, handover_requested FROM chat_conversations WHERE id = ?', [conversationId]) as any;
  const conv = convRows?.[0];

  if (conv?.mode === 'human') {
    return { shouldRespond: false, reason: 'Conversation is currently handled by a human agent' };
  }

  if (conv?.handover_requested || conv?.mode === 'waiting_agent') {
    return { shouldRespond: false, reason: 'Visitor requested human handover; waiting for agent' };
  }

  // Check human agent presence
  const presence = getAgentPresenceSummary();
  if (presence.isHumanAvailable && !behaviours.enable_ai_first_response) {
    return { shouldRespond: false, reason: 'Human agents are online and AI first response is off' };
  }

  return { shouldRespond: true, reason: 'AI handling is active' };
}

/**
 * Generate AI Response using OpenRouter
 */
export async function generateAIResponse(options: GenerateAIResponseOptions): Promise<GenerateAIResponseResult> {
  const { conversationId, visitorMessage, visitorName, onChunk } = options;
  const { settings, behaviours } = await getRuntimeAISettings();

  const apiKey = settings.decrypted_api_key;
  if (!apiKey) {
    const fallbackText = "Hello! Thank you for reaching out to Valora Healthcare. Our clinical staffing coordinators are currently assisting other facilities. Please leave your contact details or call our 24/7 Clinical Placement Hotline directly at +1 (800) 555-0199.";
    return await saveFallbackMessage(conversationId, fallbackText, 'No OpenRouter API key configured');
  }

  // 1. Retrieve Knowledge & MySQL Data Context
  const { contextText, references } = await retrieveRelevantContext(visitorMessage);

  // 2. Fetch past conversation history from MySQL up to context_limit
  const contextLimit = Math.max(2, Math.min(settings.context_limit || 10, 20));
  const [historyRows] = await pool.query(
    `SELECT sender, content FROM chat_messages 
     WHERE conversationId = ? 
     ORDER BY timestamp DESC 
     LIMIT ?`,
    [conversationId, contextLimit]
  ) as any;

  const messagesPayload: ChatHistoryMessage[] = [];

  // Assemble System Prompt
  const fullSystemPrompt = `${settings.system_prompt || 'You are the official AI customer support assistant for Valora Healthcare.'}

You are acting under the assistant identity: "${behaviours.ai_assistant_name}".

=== RELEVANT VALORA HEALTHCARE KNOWLEDGE & DATABASE RECORDS ===
${contextText}

=== VISITOR CONTEXT ===
- Visitor Name: ${visitorName || 'Website Visitor'}
- Current Date/Time: ${new Date().toUTCString()}

=== STRICT GUIDELINES ===
1. Use the knowledge provided above to accurately describe Valora's staffing models, travel contracts, clinical specialties, and recruitment process.
2. If asked about open jobs or positions, refer ONLY to the active jobs listed in the database records above and provide the link /careers.
3. If asked about general topics (e.g. differences between RN and LPN, what is healthcare staffing, general career advice), provide helpful, professional answers.
4. If the visitor requests to speak with a coordinator, recruitment director, or human agent, advise them that they can click the "Talk to a Human" button anytime or dial +1 (800) 555-0199.
5. Keep your answer concise, engaging, and professional.
`;

  messagesPayload.push({ role: 'system', content: fullSystemPrompt });

  // Add historical messages (reversed so oldest is first)
  const historyList = (historyRows || []).reverse();
  for (const row of historyList) {
    const role: 'user' | 'assistant' = row.sender === 'visitor' ? 'user' : 'assistant';
    messagesPayload.push({ role, content: row.content });
  }

  // Ensure current user message is at the end if not already in history
  if (messagesPayload.length === 0 || messagesPayload[messagesPayload.length - 1].content !== visitorMessage) {
    messagesPayload.push({ role: 'user', content: visitorMessage });
  }

  const endpoint = `${(settings.api_base_url || 'https://openrouter.ai/api/v1').replace(/\/$/, '')}/chat/completions`;

  // Attempt request with primary model first, then fallback model
  const modelsToTry = [settings.default_model];
  if (settings.fallback_model && settings.fallback_model !== settings.default_model) {
    modelsToTry.push(settings.fallback_model);
  }

  let finalReply = '';
  let successfulModel = settings.default_model;
  let fallbackUsed = false;
  let inputTokens = 0;
  let outputTokens = 0;
  let lastError = '';

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    if (i > 0) fallbackUsed = true;

    try {
      const controller = new AbortController();
      const timeoutSec = Math.max(10, settings.timeout_seconds || 30);
      const timeoutId = setTimeout(() => controller.abort(), timeoutSec * 1000);

      const requestBody = {
        model: currentModel,
        messages: messagesPayload,
        temperature: settings.temperature ?? 0.7,
        max_tokens: settings.max_tokens ?? 1024,
        stream: Boolean(behaviours.enable_streaming_responses && onChunk),
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://valorahealthcare.com',
          'X-Title': 'Valora Healthcare AI Support',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle Streaming vs Non-streaming
      if (requestBody.stream && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value, { stream: true });
          const lines = chunkText.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;
            if (trimmed.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const delta = parsed.choices?.[0]?.delta?.content || '';
                if (delta) {
                  accumulated += delta;
                  if (onChunk) onChunk(delta, accumulated);
                }
                if (parsed.usage) {
                  inputTokens = parsed.usage.prompt_tokens || inputTokens;
                  outputTokens = parsed.usage.completion_tokens || outputTokens;
                }
              } catch (e) {
                // Ignore partial JSON chunks
              }
            }
          }
        }

        finalReply = accumulated;
      } else {
        const data = await response.json();
        finalReply = data.choices?.[0]?.message?.content || '';
        inputTokens = data.usage?.prompt_tokens || 0;
        outputTokens = data.usage?.completion_tokens || 0;
        if (onChunk && finalReply) {
          onChunk(finalReply, finalReply);
        }
      }

      if (finalReply.trim()) {
        successfulModel = currentModel;
        break; // Successfully generated response!
      }
    } catch (err: any) {
      console.error(`[OpenRouterService] Error with model ${currentModel}:`, err.message);
      lastError = err.message || 'Model execution error';
      // If there's another model in list, loop will try fallback
    }
  }

  // If both models failed or produced empty reply, fallback gracefully
  if (!finalReply.trim()) {
    const errorFallback = "Thank you for contacting Valora Healthcare. Our AI clinical assistant is currently synchronizing with our network. A human clinical coordinator has been notified. You can also reach our 24/7 Placement Team directly at +1 (800) 555-0199.";
    return await saveFallbackMessage(conversationId, errorFallback, lastError);
  }

  // Calculate estimated cost roughly ($0.50 per 1M tokens as conservative average)
  const totalTokens = inputTokens + outputTokens;
  const estimatedCost = totalTokens > 0 ? (totalTokens / 1000000) * 0.50 : 0.0001;

  // Persist AI message in MySQL
  const messageId = crypto.randomUUID();
  await pool.query(`
    INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status, model_used, tokens_used)
    VALUES (?, ?, 'ai', ?, 'AI Clinical Assistant', ?, NOW(), 'delivered', ?, ?)
  `, [messageId, conversationId, behaviours.ai_assistant_name, finalReply, successfulModel, totalTokens]);

  // Update conversation last updated
  await pool.query('UPDATE chat_conversations SET updatedAt = NOW() WHERE id = ?', [conversationId]);

  // Log usage
  try {
    await pool.query(`
      INSERT INTO ai_usage_logs (conversation_id, model, input_tokens, output_tokens, estimated_cost, response_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [conversationId, successfulModel, inputTokens, outputTokens, estimatedCost, fallbackUsed ? 'fallback_used' : 'success']);
  } catch (e) {
    // quiet fallback for logging
  }

  return {
    messageId,
    replyText: finalReply,
    modelUsed: successfulModel,
    inputTokens,
    outputTokens,
    estimatedCost,
    fallbackUsed,
    status: fallbackUsed ? 'fallback_used' : 'success',
  };
}

/**
 * Save graceful fallback message when AI is unavailable or fails
 */
async function saveFallbackMessage(conversationId: string, text: string, errorReason?: string): Promise<GenerateAIResponseResult> {
  const messageId = crypto.randomUUID();
  const { behaviours } = await getRuntimeAISettings();

  await pool.query(`
    INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status, model_used)
    VALUES (?, ?, 'ai', ?, 'Valora Support', ?, NOW(), 'delivered', 'fallback-system')
  `, [messageId, conversationId, behaviours.ai_assistant_name, text]);

  await pool.query('UPDATE chat_conversations SET updatedAt = NOW() WHERE id = ?', [conversationId]);

  try {
    await pool.query(`
      INSERT INTO ai_usage_logs (conversation_id, model, input_tokens, output_tokens, estimated_cost, response_status)
      VALUES (?, 'fallback-system', 0, 0, 0, 'failed')
    `, [conversationId]);
  } catch (e) {}

  return {
    messageId,
    replyText: text,
    modelUsed: 'fallback-system',
    inputTokens: 0,
    outputTokens: 0,
    estimatedCost: 0,
    fallbackUsed: true,
    status: 'error',
    error: errorReason,
  };
}
