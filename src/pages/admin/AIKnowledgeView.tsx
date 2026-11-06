import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ExternalLink,
  Save,
  X,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const CATEGORIES = [
  'Company Information',
  'Healthcare Staffing',
  'Nursing',
  'Allied Health',
  'Permanent Placement',
  'Recruitment Process',
  'Careers',
  'Employer Support',
  'General FAQs',
];

export const AIKnowledgeView: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formContent, setFormContent] = useState('');
  const [formPublished, setFormPublished] = useState(true);
  const [formEnabled, setFormEnabled] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [categoryFilter, searchQuery]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getKnowledgeArticles({
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchQuery || undefined,
      });
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormTitle('');
    setFormCategory(CATEGORIES[0]);
    setFormContent('');
    setFormPublished(true);
    setFormEnabled(true);
    setSelectedArticle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: any) => {
    setModalMode('edit');
    setSelectedArticle(art);
    setFormTitle(art.title);
    setFormCategory(art.category);
    setFormContent(art.content);
    setFormPublished(Boolean(art.published));
    setFormEnabled(Boolean(art.enabled));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    try {
      setSaving(true);
      if (modalMode === 'create') {
        await adminApi.createKnowledgeArticle({
          title: formTitle.trim(),
          category: formCategory,
          content: formContent.trim(),
          published: formPublished,
          enabled: formEnabled,
        });
      } else if (selectedArticle) {
        await adminApi.updateKnowledgeArticle(selectedArticle.id, {
          title: formTitle.trim(),
          category: formCategory,
          content: formContent.trim(),
          published: formPublished,
          enabled: formEnabled,
        });
      }
      setIsModalOpen(false);
      loadArticles();
    } catch (err: any) {
      alert(err.message || 'Failed to save knowledge article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteKnowledgeArticle(id);
      setDeleteConfirmId(null);
      loadArticles();
    } catch (err: any) {
      alert(err.message || 'Failed to delete knowledge article');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#087F8C] to-[#19A6A0] text-white flex items-center justify-center shadow-xs">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#16324F]">AI Knowledge Base</h2>
            <p className="text-xs text-slate-500">
              Manage clinical articles, FAQs, and service details ingested by the OpenRouter AI virtual assistant.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#087F8C] hover:bg-[#076E7A] text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} />
          <span>Add Knowledge Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles by title, keywords, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-[#087F8C] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({articles.length})
          </button>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border-none focus:ring-2 focus:ring-[#087F8C]"
          >
            <option value="all">Filter by Category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid / List */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-3 border-[#087F8C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2 font-medium">Loading knowledge articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
          <FolderOpen size={40} className="mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-slate-700 text-sm">No knowledge articles found</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? 'Try adjusting your search query' : 'Click "Add Knowledge Article" to create your first article.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-[#087F8C]/40 transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#DDF2F0] text-[#087F8C] border border-[#087F8C]/20">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {art.published ? (
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Published
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">Draft</span>
                    )}
                    {art.enabled ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-bold">Disabled</span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#16324F] mt-2 leading-snug">{art.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed whitespace-pre-line">
                  {art.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>Updated: {new Date(art.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="p-1.5 text-slate-600 hover:text-[#087F8C] hover:bg-slate-100 rounded-lg transition"
                    title="Edit article"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(art.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete article"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#087F8C]" />
                <h3 className="font-bold text-base text-[#16324F]">
                  {modalMode === 'create' ? 'Add New Knowledge Article' : 'Edit Knowledge Article'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel Nursing Contract Guidelines & Stipends"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPublished}
                      onChange={(e) => setFormPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-[#087F8C]"
                    />
                    <span>Published</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formEnabled}
                      onChange={(e) => setFormEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-[#087F8C]"
                    />
                    <span>Enable for AI Retrieval</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Content (Markdown / Text)</label>
                <textarea
                  rows={9}
                  required
                  placeholder="Enter detailed facts, policies, FAQs, or contact guidelines..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Once saved, the AI retrieval cache is invalidated immediately so future responses use this new information right away.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#087F8C] hover:bg-[#076E7A] rounded-xl transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{modalMode === 'create' ? 'Create Article' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-[#16324F]">Delete Knowledge Article?</h3>
            <p className="text-xs text-slate-500 mt-2">
              Are you sure you want to remove this article from the AI knowledge base? The virtual assistant will immediately stop retrieving this content.
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIKnowledgeView;
