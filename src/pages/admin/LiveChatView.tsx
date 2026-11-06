import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  Phone,
  Mail,
  XCircle,
  Paperclip,
  CheckCheck,
  Search,
  Filter,
  Volume2,
  VolumeX,
  Download,
  Trash2,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Building2,
  Stethoscope,
  Info,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Bot,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { playChatChime } from '../../utils/audioChime';

interface CannedResponse {
  label: string;
  category: 'Facility' | 'Clinician' | 'General' | 'Hotline';
  text: string;
}

const CANNED_RESPONSES: CannedResponse[] = [
  {
    category: 'Facility',
    label: 'Facility Urgent Intake',
    text: "Hello! I'm a Valora Clinical Staffing Coordinator. What clinical specialty and shift window (per-diem, 13-week contract, or crisis coverage) does your facility require immediate staffing for?"
  },
  {
    category: 'Facility',
    label: 'Request Staffing Proposal',
    text: "I would be glad to tailor a custom staffing proposal for your facility. What is the best email address and direct phone number for your Nurse Executive or Chief Nursing Officer?"
  },
  {
    category: 'Clinician',
    label: 'Travel Nursing Rates',
    text: "We have active contracts across top health systems offering premium weekly stipends, day-one medical benefits, and fast-track compliance. Which state and specialty are you licensed in?"
  },
  {
    category: 'Clinician',
    label: 'Check Application Status',
    text: "Thank you for checking in! Could you please share your full legal name and professional license number so I can pull up your credential file in our clinical registry?"
  },
  {
    category: 'Hotline',
    label: '24/7 Clinical Hotline',
    text: "For emergency shift coverage or immediate after-hours dispatch, our 24/7 Clinical Placement Hotline is available directly at 1-800-555-0199."
  },
  {
    category: 'General',
    label: 'Schedule Regional Callback',
    text: "I have dispatched your staffing details to our regional account director. Would you prefer a brief 10-minute callback this morning or afternoon?"
  },
  {
    category: 'General',
    label: 'Closing Resolution',
    text: "Thank you for connecting with Valora Healthcare! If you need anything further, we are always here 24/7. Wishing you and your patient care team an exceptional day."
  }
];

const TOPIC_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  facility: { label: 'Facility Staffing', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  nursing: { label: 'Nursing Contracts', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  allied: { label: 'Allied Health', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  application: { label: 'Application Status', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  general: { label: 'General Inquiry', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' }
};

export const LiveChatView: React.FC = () => {
  const { user } = useAdminAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'open' | 'closed' | 'all'>('open');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showCanned, setShowCanned] = useState(false);
  const [showDrawer, setShowDrawer] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);
  const [deleteModalConv, setDeleteModalConv] = useState<any | null>(null);
  const [presenceStats, setPresenceStats] = useState<{ onlineCount: number; busyCount: number; offlineCount: number }>({
    onlineCount: 1,
    busyCount: 0,
    offlineCount: 0,
  });

  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.emit('join_conversation', {
      conversationId: 0,
      role: 'admin',
      userId: user?.id,
      name: user?.name || 'Valora Staffing Specialist',
    });

    socket.on('conversation_updated', () => {
      loadConversations();
    });

    socket.on('new_message', (msg: any) => {
      if (activeConv && (msg.conversation_id === activeConv.id || msg.conversationId === activeConv.id)) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }

      // Audio notification if incoming visitor or bot message
      if (msg.sender_type !== 'admin' && soundEnabled) {
        playChatChime();
      }

      loadConversations();
    });

    socket.on('mode_changed', (data: any) => {
      setActiveConv((prev: any) => (prev ? { ...prev, mode: data.mode } : null));
      loadConversations();
    });

    socket.on('handover_alert', (data: any) => {
      if (soundEnabled) playChatChime();
      loadConversations();
    });

    socket.on('presence_updated', (data: any) => {
      if (data) {
        setPresenceStats({
          onlineCount: data.onlineCount || 0,
          busyCount: data.busyCount || 0,
          offlineCount: data.offlineCount || 0,
        });
      }
    });

    socket.on('typing', (data: any) => {
      if (activeConv && data.conversationId === activeConv.id && data.senderName !== user?.name) {
        setIsVisitorTyping(data.isTyping);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [activeConv?.id, user, soundEnabled]);

  const loadConversations = async () => {
    try {
      const data = await adminApi.getChatConversations({
        status: statusFilter,
        search: searchQuery || undefined,
        topic: topicFilter !== 'all' ? topicFilter : undefined,
      });
      setConversations(data);
      if (data.length > 0 && !activeConv) {
        setActiveConv(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [statusFilter, topicFilter, searchQuery]);

  // When active conversation changes, load messages and join socket room
  useEffect(() => {
    if (!activeConv) return;
    const fetchMsgs = async () => {
      try {
        const msgs = await adminApi.getChatMessages(activeConv.id);
        setMessages(msgs);
        // Mark conversation as read in admin panel
        if (activeConv.unread_count > 0) {
          await adminApi.markChatRead(activeConv.id);
          setConversations((prev) =>
            prev.map((c) => (c.id === activeConv.id ? { ...c, unread_count: 0 } : c))
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMsgs();

    if (socketRef.current) {
      socketRef.current.emit('join_conversation', {
        conversationId: activeConv.id,
        role: 'admin',
        name: user?.name,
      });
    }
  }, [activeConv?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isVisitorTyping]);

  // Handle typing broadcast
  const handleInputChange = (val: string) => {
    setInputMsg(val);
    if (!socketRef.current || !activeConv) return;

    socketRef.current.emit('typing', {
      conversationId: activeConv.id,
      isTyping: true,
      senderName: user?.name || 'Valora Clinical Coordinator',
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typing', {
        conversationId: activeConv.id,
        isTyping: false,
        senderName: user?.name || 'Valora Clinical Coordinator',
      });
    }, 1500);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() || !activeConv) return;

    const messageText = inputMsg.trim();
    setInputMsg('');

    if (socketRef.current) {
      socketRef.current.emit('send_message', {
        conversationId: activeConv.id,
        senderType: 'admin',
        senderName: user?.name || 'Valora Staffing Specialist',
        message: messageText,
      });

      socketRef.current.emit('typing', {
        conversationId: activeConv.id,
        isTyping: false,
        senderName: user?.name,
      });
    }
  };

  const handleSelectCanned = (text: string) => {
    setInputMsg(text);
    setShowCanned(false);
  };

  const handleToggleChatStatus = async () => {
    if (!activeConv) return;
    const newStatus = activeConv.status === 'open' ? 'closed' : 'open';
    try {
      await adminApi.updateChatConversation(activeConv.id, { status: newStatus });
      setActiveConv((prev: any) => ({ ...prev, status: newStatus }));
      loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTakeover = async () => {
    if (!activeConv || !user) return;
    try {
      await adminApi.takeoverConversation(activeConv.id);
      if (socketRef.current) {
        socketRef.current.emit('admin_takeover', {
          conversationId: activeConv.id,
          adminId: user.id,
          adminName: user.name,
        });
      }
      setActiveConv((prev: any) => ({
        ...prev,
        mode: 'human',
        assigned_agent_name: user.name,
        handover_requested: false,
      }));
      const msgs = await adminApi.getChatMessages(activeConv.id);
      setMessages(msgs);
      loadConversations();
    } catch (err) {
      console.error('Takeover error:', err);
    }
  };

  const handleReturnToAI = async () => {
    if (!activeConv) return;
    try {
      await adminApi.returnConversationToAI(activeConv.id);
      if (socketRef.current) {
        socketRef.current.emit('return_to_ai', {
          conversationId: activeConv.id,
        });
      }
      setActiveConv((prev: any) => ({
        ...prev,
        mode: 'ai',
        assigned_agent_name: null,
        handover_requested: false,
      }));
      const msgs = await adminApi.getChatMessages(activeConv.id);
      setMessages(msgs);
      loadConversations();
    } catch (err) {
      console.error('Return to AI error:', err);
    }
  };

  const handleDeleteConversation = async () => {
    if (!deleteModalConv) return;
    try {
      await adminApi.deleteChatConversation(deleteModalConv.id);
      if (activeConv?.id === deleteModalConv.id) {
        setActiveConv(null);
        setMessages([]);
      }
      setDeleteModalConv(null);
      loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConv) return;

    try {
      setIsUploading(true);
      await adminApi.uploadChatAttachment(
        activeConv.id,
        file,
        'admin',
        user?.name || 'Valora Staffing Coordinator'
      );
      // reload messages
      const msgs = await adminApi.getChatMessages(activeConv.id);
      setMessages(msgs);
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyContact = () => {
    if (!activeConv) return;
    const details = `Name: ${activeConv.visitor_name || 'Website Visitor'}\nRole: ${activeConv.visitor_type || 'Unspecified'}\nTopic: ${activeConv.topic || 'General'}\nEmail: ${activeConv.visitor_email || 'N/A'}\nPhone: ${activeConv.visitor_phone || 'N/A'}\nSession: ${activeConv.session_id}`;
    navigator.clipboard.writeText(details);
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2000);
  };

  const handleExportTranscript = () => {
    if (!activeConv || messages.length === 0) return;
    const transcript = messages
      .map(
        (m) =>
          `[${new Date(m.created_at).toLocaleString()}] ${m.sender_name} (${m.sender_type}): ${m.message}`
      )
      .join('\n');
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valora-chat-${activeConv.session_id.slice(0, 8)}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render message bubble with markdown attachment link parsing
  const renderMessageContent = (text: string, isAdmin: boolean) => {
    const attachmentRegex = /\[Attachment:\s*([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = attachmentRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const fileName = match[1];
      const fileUrl = match[2];
      parts.push(
        <a
          key={match.index}
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl my-1 text-xs font-semibold transition ${
            isAdmin
              ? 'bg-white/20 text-white hover:bg-white/30'
              : 'bg-[#087F8C]/10 text-[#087F8C] hover:bg-[#087F8C]/20 border border-[#087F8C]/20'
          }`}
        >
          <FileText size={14} />
          <span className="truncate max-w-[200px]">{fileName}</span>
          <Download size={13} className="shrink-0" />
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#16324F]">Live Clinical Support Dispatch</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Socket Connected</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Engage with healthcare facility hiring executives, travel nurses, and candidate clinicians in real time.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Sound Notification Chime Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playChatChime();
            }}
            title={soundEnabled ? 'Audio Chime Enabled' : 'Audio Chime Muted'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
              soundEnabled
                ? 'bg-[#DDF2F0]/60 text-[#087F8C] border-[#087F8C]/30 hover:bg-[#DDF2F0]'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200/70'
            }`}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{soundEnabled ? 'Chime On' : 'Muted'}</span>
          </button>

          {/* Refresh List */}
          <button
            onClick={() => loadConversations()}
            className="p-2 bg-slate-100 hover:bg-slate-200/70 text-slate-600 rounded-xl transition"
            title="Refresh Conversations"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Main Split Chat View */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden h-[740px] flex">
        {/* Left Sidebar: Conversations & Filters */}
        <div className="w-84 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
          {/* Filter & Search Bar */}
          <div className="p-3.5 border-b border-slate-200 space-y-2.5 bg-white">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search visitor, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:bg-white transition"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {(['open', 'closed', 'all'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1 text-center rounded-lg text-xs font-bold capitalize transition ${
                    statusFilter === st
                      ? 'bg-white text-[#16324F] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Topic Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              <button
                onClick={() => setTopicFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition ${
                  topicFilter === 'all'
                    ? 'bg-[#087F8C] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                All Topics
              </button>
              {Object.entries(TOPIC_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setTopicFilter(key)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition ${
                    topicFilter === key
                      ? 'bg-[#087F8C] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {config.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-10 text-center">
                <div className="w-6 h-6 border-2 border-[#087F8C] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 mt-2 font-medium">Loading conversations...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <MessageSquare size={32} className="mx-auto text-slate-300 mb-2 opacity-50" />
                <p className="font-semibold text-slate-600">No conversations found</p>
                <p className="text-[11px] mt-1 text-slate-400">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Inquiries will appear here live'}
                </p>
              </div>
            ) : (
              conversations.map((c) => {
                const topicMeta = TOPIC_CONFIG[c.topic] || TOPIC_CONFIG.general;
                const isSelected = activeConv?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConv(c)}
                    className={`p-3.5 cursor-pointer transition relative ${
                      isSelected
                        ? 'bg-[#DDF2F0]/40 border-l-4 border-[#087F8C]'
                        : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#087F8C] to-[#16324F] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {(c.visitor_name || 'V').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {c.visitor_name || 'Website Visitor'}
                          </h4>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {c.visitor_email || c.session_id.slice(0, 10)}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {new Date(c.last_message_at || c.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 truncate mt-2 font-normal">
                      {c.last_message || 'Session connected'}
                    </p>

                    <div className="flex items-center justify-between gap-1 mt-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Topic Tag */}
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${topicMeta.bg} ${topicMeta.color}`}
                        >
                          {topicMeta.label}
                        </span>

                        {/* Role Tag */}
                        {c.visitor_type && (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600">
                            {c.visitor_type === 'employer' ? 'Employer' : 'Clinician'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                            c.status === 'open'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {c.status}
                        </span>

                        {c.unread_count > 0 && (
                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center & Right: Active Chat Window */}
        {activeConv ? (
          <div className="flex-1 flex bg-white overflow-hidden">
            {/* Center Chat Feed & Input */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header Bar */}
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#087F8C] to-[#16324F] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    {(activeConv.visitor_name || 'V').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#16324F] truncate">
                        {activeConv.visitor_name || 'Website Visitor'}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          activeConv.status === 'open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {activeConv.status.toUpperCase()}
                      </span>

                      {/* AI vs Human Mode Badge */}
                      {activeConv.mode === 'human' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <UserCheck size={11} />
                          <span>Human Coordinator Active</span>
                        </span>
                      ) : activeConv.mode === 'waiting_agent' || activeConv.handover_requested ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 animate-pulse">
                          <AlertCircle size={11} className="text-amber-600" />
                          <span>Handover Requested</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <Bot size={11} />
                          <span>AI Virtual Assistant Active</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      {activeConv.visitor_email && (
                        <a
                          href={`mailto:${activeConv.visitor_email}`}
                          className="flex items-center gap-1 hover:text-[#087F8C] transition"
                        >
                          <Mail size={12} />
                          <span className="truncate max-w-[150px]">{activeConv.visitor_email}</span>
                        </a>
                      )}
                      {activeConv.visitor_phone && (
                        <a
                          href={`tel:${activeConv.visitor_phone}`}
                          className="flex items-center gap-1 text-[#087F8C] font-semibold hover:underline"
                        >
                          <Phone size={12} />
                          <span>{activeConv.visitor_phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Takeover vs Return to AI Button */}
                  {activeConv.mode === 'human' ? (
                    <button
                      onClick={handleReturnToAI}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100"
                      title="Return conversation to AI Virtual Assistant"
                    >
                      <Bot size={14} />
                      <span>Return to AI</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleTakeover}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition bg-[#087F8C] hover:bg-[#076E7A] text-white shadow-xs"
                      title="Take over conversation as human coordinator"
                    >
                      <UserCheck size={14} />
                      <span>Take Over Chat</span>
                    </button>
                  )}

                  {/* Status Toggle Button */}
                  <button
                    onClick={handleToggleChatStatus}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      activeConv.status === 'open'
                        ? 'border-slate-200 text-slate-700 bg-white hover:bg-slate-100 hover:text-rose-600'
                        : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {activeConv.status === 'open' ? (
                      <>
                        <XCircle size={14} />
                        <span>Resolve / Close</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw size={14} />
                        <span>Reopen Chat</span>
                      </>
                    )}
                  </button>

                  {/* Export Transcript */}
                  <button
                    onClick={handleExportTranscript}
                    title="Export chat transcript"
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    <Download size={15} />
                  </button>

                  {/* Toggle Drawer */}
                  <button
                    onClick={() => setShowDrawer(!showDrawer)}
                    title="Toggle visitor profile & details"
                    className={`p-2 rounded-xl transition ${
                      showDrawer
                        ? 'bg-[#087F8C] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Info size={15} />
                  </button>

                  {/* Delete Conversation */}
                  <button
                    onClick={() => setDeleteModalConv(activeConv)}
                    title="Delete Conversation"
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAFC]">
                {/* Topic Banner inside Chat */}
                <div className="mx-auto max-w-md bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs text-center text-xs text-slate-600">
                  <div className="flex items-center justify-center gap-2 font-bold text-[#16324F] mb-1">
                    <ShieldCheck size={14} className="text-[#087F8C]" />
                    <span>Inquiry Topic: {(TOPIC_CONFIG[activeConv.topic] || TOPIC_CONFIG.general).label}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Visitor Role: <span className="font-semibold capitalize">{activeConv.visitor_type || 'General Visitor'}</span> • Connected via Valora Web Portal
                  </p>
                </div>

                {/* Messages List */}
                {messages.map((m) => {
                  const isAdmin = m.sender_type === 'admin';
                  const isBot = m.sender_type === 'bot';

                  if (isBot) {
                    return (
                      <div key={m.id} className="flex justify-center my-2">
                        <div className="bg-[#DDF2F0] text-[#087F8C] text-[11px] font-medium px-4 py-1.5 rounded-full border border-[#087F8C]/20 shadow-xs max-w-lg text-center">
                          {m.message}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 px-1 mb-1 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-600">{m.sender_name}</span>
                        {m.model_used && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-mono font-bold">
                            🤖 {m.model_used.split('/').pop()}
                          </span>
                        )}
                        <span>•</span>
                        <span>
                          {new Date(m.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div
                        className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          isAdmin
                            ? 'bg-[#087F8C] text-white rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                        }`}
                      >
                        {renderMessageContent(m.message, isAdmin)}
                      </div>
                    </div>
                  );
                })}

                {/* Real-Time Visitor Typing Indicator */}
                {isVisitorTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full w-fit">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C] animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span>{activeConv.visitor_name || 'Visitor'} is typing...</span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Canned Responses Popover */}
              {showCanned && (
                <div className="border-t border-slate-200 bg-white p-3 shadow-lg max-h-56 overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#16324F]">
                      <Sparkles size={14} className="text-[#087F8C]" />
                      <span>Clinical Coordinator Quick Replies</span>
                    </div>
                    <button
                      onClick={() => setShowCanned(false)}
                      className="text-xs text-slate-400 hover:text-slate-700"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {CANNED_RESPONSES.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectCanned(item.text)}
                        className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#087F8C] hover:bg-[#DDF2F0]/20 transition group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[#16324F] group-hover:text-[#087F8C]">
                            {item.label}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {item.text}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                  {/* Canned Replies Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowCanned(!showCanned)}
                    title="Quick Clinical Responses"
                    className={`p-2.5 rounded-xl border transition ${
                      showCanned
                        ? 'bg-[#087F8C] text-white border-[#087F8C]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles size={16} />
                  </button>

                  {/* Attachment Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    title="Send File or Credential Attachment"
                    className="p-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition disabled:opacity-50"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-[#087F8C] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Paperclip size={16} />
                    )}
                  </button>

                  {/* Message Input */}
                  <input
                    type="text"
                    placeholder="Type clinical coordinator response or pick quick reply..."
                    value={inputMsg}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:bg-white transition"
                  />

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputMsg.trim()}
                    className="px-4 py-2.5 bg-[#087F8C] hover:bg-[#076E7A] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                  >
                    <span>Send</span>
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Drawer: Visitor Profile & Context */}
            {showDrawer && (
              <div className="w-72 border-l border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  {/* Visitor Profile Header */}
                  <div className="text-center pb-4 border-b border-slate-200">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#087F8C] to-[#16324F] text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md">
                      {(activeConv.visitor_name || 'V').charAt(0).toUpperCase()}
                    </div>
                    <h4 className="font-bold text-sm text-[#16324F] mt-2">
                      {activeConv.visitor_name || 'Website Visitor'}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Role: <strong className="capitalize text-slate-700">{activeConv.visitor_type || 'Unspecified'}</strong>
                    </span>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Contact Details</span>
                      <button
                        onClick={handleCopyContact}
                        className="text-[11px] text-[#087F8C] hover:underline flex items-center gap-1 font-semibold"
                      >
                        {copiedContact ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedContact ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{activeConv.visitor_email || 'Not provided'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <span>{activeConv.visitor_phone || 'Not provided'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span className="text-[11px]">
                          Started: {new Date(activeConv.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Triage Topic */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1.5">
                      Intake Triage
                    </span>
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Topic</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${(TOPIC_CONFIG[activeConv.topic] || TOPIC_CONFIG.general).bg} ${(TOPIC_CONFIG[activeConv.topic] || TOPIC_CONFIG.general).color}`}>
                          {(TOPIC_CONFIG[activeConv.topic] || TOPIC_CONFIG.general).label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Session ID</span>
                        <code className="text-[10px] text-slate-600 font-mono">
                          {activeConv.session_id.slice(0, 12)}
                        </code>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Status</span>
                        <span className="capitalize font-semibold text-slate-700">
                          {activeConv.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Action */}
                  {activeConv.visitor_phone && (
                    <a
                      href={`tel:${activeConv.visitor_phone}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                    >
                      <Phone size={14} />
                      <span>Call Visitor Directly</span>
                    </a>
                  )}
                </div>

                {/* Valora Dispatch SLA Note */}
                <div className="mt-4 p-3 rounded-2xl bg-[#DDF2F0]/60 border border-[#087F8C]/20 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-[#087F8C] mb-1">
                    <ShieldCheck size={14} />
                    <span>Clinical Placement SLA</span>
                  </div>
                  Target response time is &lt; 60 seconds for critical care facility requests.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-50/30">
            <div className="w-16 h-16 rounded-3xl bg-[#DDF2F0] text-[#087F8C] flex items-center justify-center mb-3">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-base font-bold text-[#16324F]">Select a conversation</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm text-center">
              Choose an active inquiry from the left panel to begin chatting, send credentials, or manage triage status.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalConv && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="font-bold text-base text-[#16324F]">Delete Conversation?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to delete the chat history for{' '}
              <strong>{deleteModalConv.visitor_name || 'Website Visitor'}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteModalConv(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConversation}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChatView;
