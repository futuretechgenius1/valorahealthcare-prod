// Admin API Client for interacting with real MySQL backend

const getAuthHeaders = () => {
  const token = localStorage.getItem('valora_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const adminApi = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async getMe() {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await fetch('/api/dashboard/stats', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
    return data;
  },

  async getRecentActivity() {
    const res = await fetch('/api/dashboard/recent-activity', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch activity');
    return data;
  },

  // Enquiries
  async getEnquiries(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`/api/enquiries?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch enquiries');
    return data.enquiries || [];
  },

  async updateEnquiry(id: number, payload: { status?: string; admin_notes?: string }) {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update enquiry');
    return data;
  },

  async deleteEnquiry(id: number) {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete enquiry');
    return data;
  },

  // Employers
  async getEmployers(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`/api/employers?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch employers');
    return data.employers || [];
  },

  async createEmployer(payload: any) {
    const res = await fetch('/api/employers', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create employer');
    return data;
  },

  async updateEmployer(id: number, payload: any) {
    const res = await fetch(`/api/employers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update employer');
    return data;
  },

  async deleteEmployer(id: number) {
    const res = await fetch(`/api/employers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete employer');
    return data;
  },

  // Candidates
  async getCandidates(params?: { status?: string; profession?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.profession) query.append('profession', params.profession);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`/api/candidates?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch candidates');
    return data.candidates || [];
  },

  async createCandidate(payload: any) {
    const res = await fetch('/api/candidates', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create candidate');
    return data;
  },

  async updateCandidate(id: number, payload: any) {
    const res = await fetch(`/api/candidates/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update candidate');
    return data;
  },

  async deleteCandidate(id: number) {
    const res = await fetch(`/api/candidates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete candidate');
    return data;
  },

  // Staffing Requests
  async getStaffingRequests(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`/api/staffing-requests?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch staffing requests');
    return data.staffing_requests || [];
  },

  async updateStaffingRequest(id: number, payload: { status?: string; priority?: string }) {
    const res = await fetch(`/api/staffing-requests/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update staffing request');
    return data;
  },

  async deleteStaffingRequest(id: number) {
    const res = await fetch(`/api/staffing-requests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete staffing request');
    return data;
  },

  // Jobs
  async getJobs(params?: { status?: string; department?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.department) query.append('department', params.department);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`/api/jobs?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch jobs');
    return data.jobs || [];
  },

  async createJob(payload: any) {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create job');
    return data;
  },

  async updateJob(id: number, payload: any) {
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update job');
    return data;
  },

  async deleteJob(id: number) {
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete job');
    return data;
  },

  // Applications
  async getApplications(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`/api/applications?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch applications');
    return data.applications || [];
  },

  async updateApplication(id: number, payload: { status?: string; admin_notes?: string }) {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update application');
    return data;
  },

  // Live Chat
  async getChatConversations(params?: { status?: string; search?: string; topic?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.topic) query.append('topic', params.topic);
    const res = await fetch(`/api/chat/conversations?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch chat conversations');
    return data.conversations || [];
  },

  async getChatMessages(conversationId: number) {
    const res = await fetch(`/api/chat/messages/${conversationId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch messages');
    return data.messages || [];
  },

  async updateChatConversation(id: number, payload: { status?: string; assigned_to?: number | null; topic?: string }) {
    const res = await fetch(`/api/chat/conversations/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update conversation');
    return data;
  },

  async markChatRead(id: number) {
    const res = await fetch(`/api/chat/conversations/${id}/mark-read`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async deleteChatConversation(id: number) {
    const res = await fetch(`/api/chat/conversations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete conversation');
    return data;
  },

  async uploadChatAttachment(conversationId: number, file: File, senderType: string, senderName: string) {
    const formData = new FormData();
    formData.append('conversation_id', String(conversationId));
    formData.append('sender_type', senderType);
    formData.append('sender_name', senderName);
    formData.append('attachment', file);

    const res = await fetch('/api/chat/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload chat file');
    return data;
  },

  // Notifications
  async getNotifications() {
    const res = await fetch('/api/notifications', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch notifications');
    return data;
  },

  async markNotificationsRead() {
    const res = await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Admin Users & Roles
  async getUsers() {
    const res = await fetch('/api/users', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
    return data.users || [];
  },

  async createUser(payload: any) {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create user');
    return data;
  },

  async updateUser(id: number, payload: any) {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update user');
    return data;
  },

  async deleteUser(id: number) {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete user');
    return data;
  },

  async getRoles() {
    const res = await fetch('/api/roles', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch roles');
    return data.roles || [];
  },

  // Settings
  async getSettings() {
    const res = await fetch('/api/settings', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
    return data.settings || {};
  },

  async getPublicSettings() {
    const res = await fetch('/api/settings/public');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch public settings');
    return data;
  },

  async updateSettings(settings: Record<string, string>) {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save settings');
    return data;
  },

  async uploadLogo(file: File) {
    const token = localStorage.getItem('valora_admin_token');
    const formData = new FormData();
    formData.append('logo', file);

    const res = await fetch('/api/settings/logo', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload logo');
    return data;
  },

  async deleteLogo() {
    const res = await fetch('/api/settings/logo', {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete logo');
    return data;
  },

  // ==========================================
  // AI & AUTOMATION CLIENT METHODS
  // ==========================================

  async getAISettings() {
    const res = await fetch('/api/admin/ai/settings', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch AI settings');
    return data;
  },

  async updateAISettings(payload: any) {
    const res = await fetch('/api/admin/ai/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update AI settings');
    return data;
  },

  async testOpenRouterConnection(payload?: { api_key?: string; model_id?: string; api_base_url?: string }) {
    const res = await fetch('/api/admin/ai/test-connection', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload || {}),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Connection test failed');
    return data;
  },

  async getOpenRouterModels() {
    const res = await fetch('/api/admin/ai/models', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch OpenRouter models');
    return data.models || [];
  },

  // AI Knowledge Base
  async getKnowledgeArticles(params?: { category?: string; status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`/api/admin/ai/knowledge?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch knowledge articles');
    return data.articles || [];
  },

  async createKnowledgeArticle(payload: { title: string; category: string; content: string; published?: boolean; enabled?: boolean }) {
    const res = await fetch('/api/admin/ai/knowledge', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create knowledge article');
    return data;
  },

  async updateKnowledgeArticle(id: number, payload: Partial<{ title: string; category: string; content: string; published: boolean; enabled: boolean }>) {
    const res = await fetch(`/api/admin/ai/knowledge/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update knowledge article');
    return data;
  },

  async deleteKnowledgeArticle(id: number) {
    const res = await fetch(`/api/admin/ai/knowledge/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete knowledge article');
    return data;
  },

  // AI Analytics
  async getAIAnalytics(range?: string) {
    const res = await fetch(`/api/admin/ai/analytics?range=${range || '30d'}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch AI analytics');
    return data;
  },

  // Presence & Handover
  async getPresence() {
    const res = await fetch('/api/admin/presence', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch presence');
    return data;
  },

  async sendPresenceHeartbeat(status?: string) {
    const res = await fetch('/api/admin/presence/heartbeat', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async updatePresenceStatus(status: 'online' | 'busy' | 'offline') {
    const res = await fetch('/api/admin/presence/status', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update presence status');
    return data;
  },

  async requestHumanHandover(conversationId: string | number) {
    const res = await fetch(`/api/chat/conversations/${conversationId}/request-human`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  async takeoverConversation(conversationId: string | number) {
    const res = await fetch(`/api/chat/conversations/${conversationId}/takeover`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Takeover failed');
    return data;
  },

  async returnConversationToAI(conversationId: string | number) {
    const res = await fetch(`/api/chat/conversations/${conversationId}/return-to-ai`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Return to AI failed');
    return data;
  },
};
