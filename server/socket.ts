import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import crypto from 'crypto';
import { pool } from './db';
import { shouldAIRespond, generateAIResponse } from './services/openRouterService';
import { updateAgentHeartbeat, setAgentStatus, getAgentPresenceSummary } from './services/presenceService';
import { getRuntimeAISettings } from './services/aiSettingsService';

let ioInstance: SocketIOServer | null = null;

export function getIO(): SocketIOServer | null {
  return ioInstance;
}

export function setupSocketIO(server: HttpServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    // Join conversation room
    socket.on('join_conversation', async (data: { conversationId: string | number; role?: string; name?: string; userId?: number }) => {
      const convIdStr = String(data.conversationId);
      const room = `conversation_${convIdStr}`;
      socket.join(room);

      if (data.role === 'admin') {
        socket.join('admins_room');
        if (data.userId) {
          updateAgentHeartbeat(data.userId, data.name || 'Admin', data.role, 'online');
        }
      }

      console.log(`[Socket] User ${data.name || socket.id} joined room ${room}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (data: { conversationId: string | number }) => {
      const room = `conversation_${data.conversationId}`;
      socket.leave(room);
    });

    // Admin presence heartbeat
    socket.on('agent_heartbeat', (data: { userId: number; name: string; role: string; status?: 'online' | 'busy' | 'offline' }) => {
      if (data?.userId) {
        updateAgentHeartbeat(data.userId, data.name, data.role, data.status);
        io.to('admins_room').emit('presence_updated', getAgentPresenceSummary());
      }
    });

    // Admin sets presence status
    socket.on('set_agent_presence', (data: { userId: number; status: 'online' | 'busy' | 'offline' }) => {
      if (data?.userId) {
        setAgentStatus(data.userId, data.status);
        io.to('admins_room').emit('presence_updated', getAgentPresenceSummary());
      }
    });

    // Visitor requests human handover
    socket.on('request_human', async (data: { conversationId: string | number; visitorName?: string }) => {
      const convIdStr = String(data.conversationId);
      try {
        await pool.query(
          `UPDATE chat_conversations 
           SET mode = 'waiting_agent', handover_requested = TRUE, updatedAt = NOW() 
           WHERE id = ?`,
          [convIdStr]
        );

        const noticeMsgId = crypto.randomUUID();
        const noticeText = "You have requested to speak with a human clinical coordinator. Our placement team has been alerted and will join this session shortly. You can also reach our 24/7 Clinical Placement Hotline directly at +1 (800) 555-0199.";

        await pool.query(`
          INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status)
          VALUES (?, ?, 'ai', 'Valora Assistant', 'System Notice', ?, NOW(), 'delivered')
        `, [noticeMsgId, convIdStr, noticeText]);

        const noticePayload = {
          id: noticeMsgId,
          conversation_id: convIdStr,
          conversationId: convIdStr,
          sender_type: 'bot',
          sender: 'ai',
          sender_name: 'Valora Assistant',
          senderName: 'Valora Assistant',
          message: noticeText,
          content: noticeText,
          created_at: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          status: 'delivered',
        };

        io.to(`conversation_${convIdStr}`).emit('new_message', noticePayload);
        io.to(`conversation_${convIdStr}`).emit('mode_changed', { mode: 'waiting_agent', handoverRequested: true });

        // Alert all admin coordinators
        io.to('admins_room').emit('handover_alert', {
          conversationId: convIdStr,
          visitorName: data.visitorName || 'Visitor',
          timestamp: new Date().toISOString(),
        });
        io.to('admins_room').emit('conversation_updated', {
          conversationId: convIdStr,
          lastMessage: 'Requested human assistance',
          mode: 'waiting_agent',
          handoverRequested: true,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[Socket] Error requesting human:', err);
      }
    });

    // Admin takes over conversation
    socket.on('admin_takeover', async (data: { conversationId: string | number; adminId: number; adminName: string }) => {
      const convIdStr = String(data.conversationId);
      try {
        await pool.query(
          `UPDATE chat_conversations 
           SET mode = 'human', assigned_agent_id = ?, assigned_agent_name = ?, handover_requested = FALSE, updatedAt = NOW() 
           WHERE id = ?`,
          [data.adminId, data.adminName, convIdStr]
        );

        const noticeMsgId = crypto.randomUUID();
        const noticeText = `Clinical Coordinator ${data.adminName} has joined the conversation. How can we assist your clinical staffing needs?`;

        await pool.query(`
          INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status)
          VALUES (?, ?, 'admin', ?, 'Clinical Coordinator', ?, NOW(), 'delivered')
        `, [noticeMsgId, convIdStr, data.adminName, noticeText]);

        const noticePayload = {
          id: noticeMsgId,
          conversation_id: convIdStr,
          conversationId: convIdStr,
          sender_type: 'admin',
          sender: 'admin',
          sender_name: data.adminName,
          senderName: data.adminName,
          message: noticeText,
          content: noticeText,
          created_at: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          status: 'delivered',
        };

        io.to(`conversation_${convIdStr}`).emit('new_message', noticePayload);
        io.to(`conversation_${convIdStr}`).emit('mode_changed', { mode: 'human', agentName: data.adminName });
        io.to('admins_room').emit('conversation_updated', {
          conversationId: convIdStr,
          mode: 'human',
          assignedAgent: data.adminName,
          lastMessage: noticeText,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[Socket] Error in admin takeover:', err);
      }
    });

    // Admin returns conversation to AI
    socket.on('return_to_ai', async (data: { conversationId: string | number }) => {
      const convIdStr = String(data.conversationId);
      try {
        await pool.query(
          `UPDATE chat_conversations 
           SET mode = 'ai', assigned_agent_id = NULL, assigned_agent_name = NULL, handover_requested = FALSE, updatedAt = NOW() 
           WHERE id = ?`,
          [convIdStr]
        );

        const noticeMsgId = crypto.randomUUID();
        const { behaviours } = await getRuntimeAISettings();
        const noticeText = `Conversation returned to ${behaviours.ai_assistant_name}. Feel free to ask any clinical staffing, recruitment, or career questions!`;

        await pool.query(`
          INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status)
          VALUES (?, ?, 'ai', ?, 'System Dispatch', ?, NOW(), 'delivered')
        `, [noticeMsgId, convIdStr, behaviours.ai_assistant_name, noticeText]);

        const noticePayload = {
          id: noticeMsgId,
          conversation_id: convIdStr,
          conversationId: convIdStr,
          sender_type: 'bot',
          sender: 'ai',
          sender_name: behaviours.ai_assistant_name,
          senderName: behaviours.ai_assistant_name,
          message: noticeText,
          content: noticeText,
          created_at: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          status: 'delivered',
        };

        io.to(`conversation_${convIdStr}`).emit('new_message', noticePayload);
        io.to(`conversation_${convIdStr}`).emit('mode_changed', { mode: 'ai' });
        io.to('admins_room').emit('conversation_updated', {
          conversationId: convIdStr,
          mode: 'ai',
          lastMessage: noticeText,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[Socket] Error returning to AI:', err);
      }
    });

    // Send chat message
    socket.on('send_message', async (data: {
      conversationId: string | number;
      senderType: 'visitor' | 'admin' | 'bot' | 'ai';
      senderName: string;
      message: string;
    }) => {
      try {
        const { conversationId, senderType, senderName, message } = data;
        if (!conversationId || !message) return;

        const msgId = crypto.randomUUID();
        const convIdStr = String(conversationId);
        const mappedSender = senderType === 'bot' ? 'ai' : senderType === 'admin' ? 'admin' : 'visitor';
        const senderRole = senderType === 'admin' ? 'Clinical Coordinator' : senderType === 'bot' || senderType === 'ai' ? 'Automated Dispatch' : 'Visitor';

        // Persist message in MySQL
        await pool.query(`
          INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status)
          VALUES (?, ?, ?, ?, ?, ?, NOW(), 'delivered')
        `, [msgId, convIdStr, mappedSender, senderName || 'User', senderRole, message]);

        // Update conversation last activity & unread counter
        if (mappedSender === 'visitor') {
          await pool.query('UPDATE chat_conversations SET updatedAt = NOW(), unreadByAdmin = unreadByAdmin + 1 WHERE id = ?', [convIdStr]);
        } else {
          await pool.query('UPDATE chat_conversations SET updatedAt = NOW() WHERE id = ?', [convIdStr]);
        }

        const msgPayload = {
          id: msgId,
          conversation_id: convIdStr,
          conversationId: convIdStr,
          sender_type: mappedSender === 'ai' ? 'bot' : mappedSender,
          sender: mappedSender,
          sender_name: senderName,
          senderName: senderName,
          message: message,
          content: message,
          created_at: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          status: 'delivered',
        };

        // Emit message to everyone in the room
        io.to(`conversation_${convIdStr}`).emit('new_message', msgPayload);

        // Also emit to all admins so conversation list updates live
        io.to('admins_room').emit('conversation_updated', {
          conversationId: convIdStr,
          lastMessage: message,
          senderType: mappedSender,
          senderName: senderName,
          timestamp: new Date().toISOString(),
        });

        // ==========================================
        // AI ASSISTANT AUTOMATIC RESPONSE LOGIC
        // ==========================================
        if (mappedSender === 'visitor') {
          const aiCheck = await shouldAIRespond(convIdStr);
          if (aiCheck.shouldRespond) {
            const { behaviours } = await getRuntimeAISettings();
            const aiName = behaviours.ai_assistant_name || 'Valora AI Virtual Assistant';

            // Show AI typing indicator
            io.to(`conversation_${convIdStr}`).emit('typing', {
              conversationId: convIdStr,
              senderName: aiName,
              isTyping: true,
            });

            // Stream AI tokens to room
            generateAIResponse({
              conversationId: convIdStr,
              visitorMessage: message,
              visitorName: senderName,
              onChunk: (chunk, fullText) => {
                io.to(`conversation_${convIdStr}`).emit('ai_stream_chunk', {
                  conversationId: convIdStr,
                  senderName: aiName,
                  chunk,
                  fullText,
                });
              },
            }).then((aiResult) => {
              // Clear typing indicator
              io.to(`conversation_${convIdStr}`).emit('typing', {
                conversationId: convIdStr,
                senderName: aiName,
                isTyping: false,
              });

              const aiPayload = {
                id: aiResult.messageId,
                conversation_id: convIdStr,
                conversationId: convIdStr,
                sender_type: 'bot',
                sender: 'ai',
                sender_name: aiName,
                senderName: aiName,
                message: aiResult.replyText,
                content: aiResult.replyText,
                model_used: aiResult.modelUsed,
                created_at: new Date().toISOString(),
                timestamp: new Date().toISOString(),
                status: 'delivered',
              };

              io.to(`conversation_${convIdStr}`).emit('new_message', aiPayload);
              io.to(`conversation_${convIdStr}`).emit('ai_stream_end', {
                conversationId: convIdStr,
                messageId: aiResult.messageId,
                fullText: aiResult.replyText,
              });

              io.to('admins_room').emit('conversation_updated', {
                conversationId: convIdStr,
                lastMessage: aiResult.replyText,
                senderType: 'ai',
                senderName: aiName,
                timestamp: new Date().toISOString(),
              });
            }).catch((err) => {
              console.error('[Socket] AI Generation error:', err);
              io.to(`conversation_${convIdStr}`).emit('typing', {
                conversationId: convIdStr,
                senderName: aiName,
                isTyping: false,
              });
            });
          }
        }
      } catch (err) {
        console.error('[Socket] Error saving/emitting message:', err);
      }
    });

    // Typing indicators
    socket.on('typing', (data: { conversationId: string | number; senderName: string; isTyping: boolean }) => {
      socket.to(`conversation_${data.conversationId}`).emit('typing', data);
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
}
