import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  MessageSquare,
  X,
  Send,
  User,
  ChevronDown,
  Paperclip,
  Volume2,
  VolumeX,
  Phone,
  Building,
  Stethoscope,
  Briefcase,
  FileCheck,
  RotateCcw,
  Sparkles,
  Bot,
  UserCheck,
  Users,
  ExternalLink,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { playChatChime } from '../utils/audioChime';

interface ChatMessage {
  id: string | number;
  sender_type: 'visitor' | 'admin' | 'bot' | 'ai';
  sender_name: string;
  message: string;
  created_at: string;
  model_used?: string;
}

const TOPICS = [
  { id: 'Facility Staffing', label: 'Facility Staffing Request', icon: Building, desc: 'Hospitals & Medical Centers' },
  { id: 'Nursing Opportunities', label: 'Nursing Contracts (RN/LPN)', icon: Stethoscope, desc: 'Travel & Per Diem Shifts' },
  { id: 'Allied Health', label: 'Allied Health & Therapy', icon: Briefcase, desc: 'PT, OT, Lab & Imaging' },
  { id: 'Application Status', label: 'Check Application Status', icon: FileCheck, desc: 'Existing Candidates' },
];

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [conversation, setConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Facility Staffing');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorType, setVisitorType] = useState<'employer' | 'candidate'>('employer');
  const [hasStarted, setHasStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState('');
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [handoverLoading, setHandoverLoading] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Restore session
  useEffect(() => {
    const savedSessionId = localStorage.getItem('valora_chat_session_id');
    const savedName = localStorage.getItem('valora_chat_visitor_name');
    const savedEmail = localStorage.getItem('valora_chat_visitor_email');
    const savedPhone = localStorage.getItem('valora_chat_visitor_phone');
    const savedTopic = localStorage.getItem('valora_chat_topic');

    if (savedName) setVisitorName(savedName);
    if (savedEmail) setVisitorEmail(savedEmail);
    if (savedPhone) setVisitorPhone(savedPhone);
    if (savedTopic) setSelectedTopic(savedTopic);

    if (savedSessionId) {
      setHasStarted(true);
      startOrRestoreChat(savedSessionId, savedName || 'Visitor', savedEmail || undefined, savedPhone || undefined, savedTopic || undefined);
    } else {
      // Show teaser bubble after 4 seconds for fresh visitors
      const timer = setTimeout(() => {
        if (!isOpen) setShowTeaser(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startOrRestoreChat = async (
    sessionId: string,
    name: string,
    email?: string,
    phone?: string,
    topic?: string
  ) => {
    try {
      setLoading(true);
      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          visitor_name: name,
          visitor_email: email || null,
          visitor_phone: phone || null,
          topic: topic || selectedTopic,
          visitor_type: visitorType === 'employer' ? 'Healthcare Facility Employer' : 'Clinical Professional',
        }),
      });
      const data = await res.json();
      if (data.conversation) {
        setConversation(data.conversation);
        // Load messages
        const msgRes = await fetch(`/api/chat/messages/${data.conversation.id}`);
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);

        initSocket(data.conversation.id, name);
      }
    } catch (err) {
      console.error('Error starting chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const initSocket = (conversationId: string | number, name: string) => {
    if (socketRef.current) socketRef.current.disconnect();

    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.emit('join_conversation', {
      conversationId,
      role: 'visitor',
      name,
    });

    socket.on('new_message', (msg: any) => {
      setStreamingText('');
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      if (msg.sender_type !== 'visitor') {
        if (soundEnabled) {
          playChatChime();
        }
        if (!isOpen) {
          setUnread((u) => u + 1);
        }
      }
    });

    // Real-time AI token streaming
    socket.on('ai_stream_chunk', (data: { chunk: string; fullText: string }) => {
      setStreamingText(data.fullText);
    });

    socket.on('ai_stream_end', () => {
      setStreamingText('');
    });

    socket.on('typing', (data: { senderName: string; isTyping: boolean }) => {
      setIsTyping(data.isTyping);
      setTypingSender(data.senderName || 'Coordinator');
    });

    socket.on('mode_changed', (data: { mode: string; agentName?: string }) => {
      setConversation((prev: any) => (prev ? { ...prev, mode: data.mode, assigned_agent_name: data.agentName } : null));
      setHandoverLoading(false);
    });

    socket.on('conversation_status_changed', (data: { status: string }) => {
      setConversation((prev: any) => (prev ? { ...prev, status: data.status } : null));
    });
  };

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setShowTeaser(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, streamingText]);

  // Handle typing indicator broadcast
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMsg(e.target.value);
    if (socketRef.current && conversation) {
      socketRef.current.emit('typing', {
        conversationId: conversation.id,
        senderName: visitorName || 'Visitor',
        isTyping: true,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', {
          conversationId: conversation.id,
          senderName: visitorName || 'Visitor',
          isTyping: false,
        });
      }, 1500);
    }
  };

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = 'vis_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    const finalName = visitorName.trim() || 'Visitor';

    localStorage.setItem('valora_chat_session_id', sessionId);
    localStorage.setItem('valora_chat_visitor_name', finalName);
    if (visitorEmail) localStorage.setItem('valora_chat_visitor_email', visitorEmail);
    if (visitorPhone) localStorage.setItem('valora_chat_visitor_phone', visitorPhone);
    localStorage.setItem('valora_chat_topic', selectedTopic);

    setHasStarted(true);
    startOrRestoreChat(sessionId, finalName, visitorEmail, visitorPhone, selectedTopic);
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const text = customText || inputMsg.trim();
    if (!text || !conversation) return;

    if (!customText) setInputMsg('');

    if (socketRef.current) {
      socketRef.current.emit('typing', {
        conversationId: conversation.id,
        senderName: visitorName || 'Visitor',
        isTyping: false,
      });

      socketRef.current.emit('send_message', {
        conversationId: conversation.id,
        senderType: 'visitor',
        senderName: visitorName || 'Visitor',
        message: text,
      });
    }
  };

  // Request human takeover
  const handleRequestHuman = async () => {
    if (!conversation) return;
    setHandoverLoading(true);
    try {
      if (socketRef.current) {
        socketRef.current.emit('request_human', {
          conversationId: conversation.id,
          visitorName: visitorName || 'Visitor',
        });
      }
      await fetch(`/api/chat/conversations/${conversation.id}/request-human`, {
        method: 'POST',
      });
      setConversation((prev: any) => ({ ...prev, mode: 'waiting_agent', handover_requested: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setHandoverLoading(false);
    }
  };

  // Upload attachment file (resume / clinical spec)
  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !conversation) return;
    const file = e.target.files[0];
    setUploadingAttachment(true);

    try {
      const formData = new FormData();
      formData.append('conversation_id', String(conversation.id));
      formData.append('sender_type', 'visitor');
      formData.append('sender_name', visitorName || 'Visitor');
      formData.append('attachment', file);

      const res = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload document');
    } catch (err: any) {
      alert(err.message || 'Error uploading document');
    } finally {
      setUploadingAttachment(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetChat = () => {
    if (!confirm('Start a fresh conversation? This will clear the current chat history on this browser.')) return;
    localStorage.removeItem('valora_chat_session_id');
    setConversation(null);
    setMessages([]);
    setHasStarted(false);
    setStreamingText('');
    if (socketRef.current) socketRef.current.disconnect();
  };

  // Helper to render message text with markdown link & internal route support
  const renderMessageContent = (msg: string) => {
    // Check for markdown links: [label](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(msg)) !== null) {
      if (match.index > lastIndex) {
        parts.push(msg.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      const isInternal = url.startsWith('/');

      parts.push(
        <a
          key={match.index}
          href={url}
          target={isInternal ? '_self' : '_blank'}
          rel={isInternal ? undefined : 'noopener noreferrer'}
          className="font-bold underline text-[#087F8C] hover:text-[#076E7A] inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200"
        >
          <span>{label}</span>
          <ExternalLink size={10} />
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < msg.length) {
      parts.push(msg.substring(lastIndex));
    }

    return parts.length > 0 ? parts : msg;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Teaser Prompt */}
      {!isOpen && showTeaser && (
        <div className="absolute bottom-16 right-0 w-72 sm:w-80 bg-white p-4 rounded-2xl shadow-2xl border border-slate-200/90 text-xs animate-in fade-in slide-in-from-bottom-2 mb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[#16324F]">Valora AI Clinical Desk</span>
            </div>
            <button
              onClick={() => setShowTeaser(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-slate-600 mt-1.5 leading-relaxed">
            Hello! I am Valora's virtual assistant. Ask me anything about healthcare staffing, travel nursing rates, or permanent recruitment!
          </p>
          <button
            onClick={() => {
              setShowTeaser(false);
              setIsOpen(true);
            }}
            className="mt-2.5 w-full py-2 bg-[#087F8C] hover:bg-[#076E7A] text-white text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Bot size={14} />
            <span>Start AI Live Chat</span>
          </button>
        </div>
      )}

      {/* Floating Toggle Launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-[#087F8C] via-[#0A919E] to-[#19A6A0] text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl shadow-[#087F8C]/35 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Open Live Chat"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={18} />
            </div>
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md">
                {unread}
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold tracking-tight leading-tight">Valora AI Live Chat</p>
            <p className="text-[10px] text-teal-200 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Instant AI + Human Support</span>
            </p>
          </div>
        </button>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-[360px] sm:w-[420px] h-[590px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#16324F] to-[#1F466C] text-white px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#087F8C] to-[#19A6A0] flex items-center justify-center font-bold text-white text-xs shadow-md">
                  <Bot size={18} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#16324F]" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm tracking-tight leading-tight flex items-center gap-1.5">
                  <span>Valora AI Virtual Assistant</span>
                </h4>
                <p className="text-[10px] text-teal-300 flex items-center gap-1 mt-0.5">
                  {conversation?.mode === 'human' ? (
                    <span className="text-emerald-300 font-semibold flex items-center gap-1">
                      <UserCheck size={11} /> Connected with {conversation.assigned_agent_name || 'Coordinator'}
                    </span>
                  ) : conversation?.mode === 'waiting_agent' ? (
                    <span className="text-amber-300 font-semibold animate-pulse flex items-center gap-1">
                      <Users size={11} /> Connecting to Human Coordinator...
                    </span>
                  ) : (
                    <span>Powered by Valora Knowledge & OpenRouter</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              {/* Direct Call Button */}
              <a
                href="tel:18005550199"
                title="Call 24/7 Clinical Hotline: +1 (800) 555-0199"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <Phone size={14} />
              </a>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Chimes' : 'Unmute Chimes'}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} className="text-slate-400" />}
              </button>

              {/* Reset Session */}
              {hasStarted && (
                <button
                  onClick={handleResetChat}
                  title="Start Fresh Conversation"
                  className="p-1.5 hover:text-amber-300 hover:bg-white/10 rounded-lg transition"
                >
                  <RotateCcw size={14} />
                </button>
              )}

              {/* Minimize Window */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <ChevronDown size={17} />
              </button>
            </div>
          </div>

          {/* Body Section */}
          {!hasStarted ? (
            /* Triage & User Intake View */
            <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between bg-slate-50/70">
              <div className="space-y-4">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DDF2F0] text-[#087F8C] text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Sparkles size={11} /> AI Virtual Assistant
                  </span>
                  <h5 className="font-bold text-[#16324F] text-base">How can we assist you today?</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    "Hello! Welcome to Valora Healthcare. I'm your virtual assistant. How can I help you today?"
                  </p>
                </div>

                {/* Topic Selector Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS.map((topic) => {
                    const Icon = topic.icon;
                    const isSelected = selectedTopic === topic.id;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white border-[#087F8C] shadow-md shadow-[#087F8C]/15 ring-2 ring-[#087F8C]/20'
                            : 'bg-white/80 border-slate-200/80 hover:bg-white text-slate-600'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-2 ${
                          isSelected ? 'bg-[#087F8C] text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon size={14} />
                        </div>
                        <div>
                          <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#087F8C]' : 'text-slate-800'}`}>
                            {topic.label}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{topic.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Contact Capture Form */}
                <form onSubmit={handleStartSubmit} className="space-y-2.5 pt-2">
                  <div className="flex bg-slate-200/60 p-0.5 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setVisitorType('employer')}
                      className={`flex-1 py-1.5 rounded-lg transition ${
                        visitorType === 'employer' ? 'bg-white text-[#087F8C] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Facility Employer
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisitorType('candidate')}
                      className={`flex-1 py-1.5 rounded-lg transition ${
                        visitorType === 'candidate' ? 'bg-white text-[#087F8C] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Healthcare Professional
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder={visitorType === 'employer' ? 'e.g. Dr. Thomas Lee' : 'e.g. Sarah Connor, RN'}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        placeholder="(555) 012-3456"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-gradient-to-r from-[#087F8C] to-[#19A6A0] hover:from-[#076E7A] hover:to-[#168E89] text-white text-xs font-bold rounded-xl shadow-md shadow-[#087F8C]/25 transition flex items-center justify-center gap-2"
                  >
                    <span>Start Conversation Now</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-400">
                🔒 HIPAA Compliant & Secure Clinical Channel
              </div>
            </div>
          ) : (
            /* Live Message Stream View */
            <div className="flex-1 flex flex-col overflow-hidden bg-[#F9FBFC]">
              {/* Context bar with 'Talk to a Human' button */}
              <div className="px-4 py-2 bg-[#DDF2F0]/50 border-b border-slate-200/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[#087F8C] truncate">
                    Topic: {conversation?.topic || selectedTopic}
                  </span>
                </div>

                {/* Talk to Human Action */}
                {conversation?.mode !== 'human' && (
                  <button
                    onClick={handleRequestHuman}
                    disabled={handoverLoading || conversation?.mode === 'waiting_agent'}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition flex items-center gap-1 shadow-xs ${
                      conversation?.mode === 'waiting_agent'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                    }`}
                    title="Request a human clinical coordinator to join"
                  >
                    <Users size={11} className="text-[#087F8C]" />
                    <span>{conversation?.mode === 'waiting_agent' ? 'Connecting Agent...' : 'Talk to a Human'}</span>
                  </button>
                )}
              </div>

              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map((m) => {
                  const isUser = m.sender_type === 'visitor';
                  const isBot = m.sender_type === 'bot' || m.sender_type === 'ai';

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        isUser ? 'items-end' : isBot ? 'items-start' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 px-1 text-[10px] text-slate-400 font-medium">
                        <span className="font-bold text-slate-600">
                          {isUser ? 'You' : isBot ? 'Valora AI Assistant' : m.sender_name}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[#087F8C] text-white rounded-br-xs shadow-md shadow-[#087F8C]/15 font-normal'
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs font-normal'
                        }`}
                      >
                        {renderMessageContent(m.message)}
                      </div>
                    </div>
                  );
                })}

                {/* Real-time Streaming Output Message */}
                {streamingText && (
                  <div className="flex flex-col items-start animate-in fade-in">
                    <div className="flex items-center gap-1.5 mb-0.5 px-1 text-[10px] text-slate-400 font-medium">
                      <span className="font-bold text-[#087F8C] flex items-center gap-1">
                        <Bot size={12} /> Valora AI Assistant (Typing...)
                      </span>
                    </div>
                    <div className="max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed bg-white text-slate-800 border border-[#087F8C]/30 rounded-bl-xs shadow-xs font-normal">
                      {renderMessageContent(streamingText)}
                      <span className="inline-block w-1.5 h-3 bg-[#087F8C] ml-1 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Coordinator is typing animation */}
                {isTyping && !streamingText && (
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs italic bg-white px-3 py-1.5 rounded-full border border-slate-200 w-fit">
                    <span className="text-[11px] font-medium text-[#087F8C]">{typingSender || 'Assistant'} is typing</span>
                    <span className="inline-flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C] animate-bounce [animation-delay:0.4s]" />
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Suggested Chips */}
              <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200/60 overflow-x-auto whitespace-nowrap flex items-center gap-1.5 no-scrollbar">
                <button
                  type="button"
                  onClick={() => handleSendMessage(undefined, 'What healthcare staffing services does Valora provide?')}
                  className="px-2.5 py-1 bg-white hover:bg-[#DDF2F0] text-[#087F8C] border border-slate-200 rounded-full text-[10px] font-semibold transition shrink-0"
                >
                  🏥 Staffing Services
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage(undefined, 'What open travel nursing contracts are available?')}
                  className="px-2.5 py-1 bg-white hover:bg-[#DDF2F0] text-[#087F8C] border border-slate-200 rounded-full text-[10px] font-semibold transition shrink-0"
                >
                  🩺 Nursing Openings
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage(undefined, 'What is the difference between an RN and an LPN?')}
                  className="px-2.5 py-1 bg-white hover:bg-[#DDF2F0] text-[#087F8C] border border-slate-200 rounded-full text-[10px] font-semibold transition shrink-0"
                >
                  💡 RN vs LPN
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage(undefined, 'How can our hospital submit an urgent staffing request?')}
                  className="px-2.5 py-1 bg-white hover:bg-[#DDF2F0] text-[#087F8C] border border-slate-200 rounded-full text-[10px] font-semibold transition shrink-0"
                >
                  ⚡ Urgent Coverage
                </button>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => handleSendMessage(e)}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                {/* File Attachment Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAttachmentUpload}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAttachment}
                  title="Attach Resume or Staffing Specification Document"
                  className="p-2 text-slate-400 hover:text-[#087F8C] hover:bg-slate-100 rounded-xl transition disabled:opacity-50"
                >
                  <Paperclip size={16} className={uploadingAttachment ? 'animate-spin' : ''} />
                </button>

                <input
                  type="text"
                  placeholder="Ask a question or request staffing..."
                  value={inputMsg}
                  onChange={handleInputChange}
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:bg-white text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="p-2.5 bg-[#087F8C] hover:bg-[#076E7A] text-white rounded-xl transition disabled:opacity-40 flex items-center justify-center shadow-md shadow-[#087F8C]/20"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveChatWidget;
