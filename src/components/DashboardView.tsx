import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Image,
  Settings,
  ShieldCheck,
  LogOut,
  TrendingUp,
  Plus,
  Mail,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  Lock,
  Eye,
  Check,
  RefreshCw,
} from 'lucide-react';
import { LeadItem, LeadStatus, ProjectItem, ArticleItem, AgencySettings } from '../types/index.js';
import {
  loginOwnerApi,
  verifyOwnerApi,
  logoutOwnerApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
  createArticleApi,
  deleteArticleApi,
  updateLeadStatusApi,
  fetchSettingsApi,
  saveSettingsApi,
  uploadMediaApi,
  fetchLeadsApi,
  fetchProjectsApi,
  fetchArticlesApi,
} from '../utils/api.js';
import { getAssetUrl, handleImageFallback } from '../utils/assets.js';

type DashboardTab =
  | 'dashboard'
  | 'leads'
  | 'projects'
  | 'articles'
  | 'media'
  | 'settings'
  | 'system';

interface DashboardViewProps {
  leads: LeadItem[];
  projects: ProjectItem[];
  onUpdateLeadStatus: (id: string, newStatus: LeadStatus) => void;
  onAddProject: (project: ProjectItem) => void;
  onExitDashboard: () => void;
}

const dashboardTabs: { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'leads', label: 'Client Enquiries', icon: Users },
  { id: 'projects', label: 'Projects & Case Studies', icon: FolderKanban },
  { id: 'articles', label: 'Blog & Articles', icon: FileText },
  { id: 'media', label: 'Media Library', icon: Image },
  { id: 'settings', label: 'Agency Settings', icon: Settings },
  { id: 'system', label: 'System & Security', icon: ShieldCheck },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads: initialLeads,
  projects: initialProjects,
  onExitDashboard,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState('tharusudeep242@gmail.com');
  const [loginPassword, setLoginPassword] = useState('ZentraAdmin2025!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  // Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projFormTitle, setProjFormTitle] = useState('');
  const [projFormCategory, setProjFormCategory] = useState<'Websites' | '3D' | 'Branding' | 'Apps'>('3D');
  const [projFormSubtitle, setProjFormSubtitle] = useState('');
  const [projFormDesc, setProjFormDesc] = useState('');
  const [projFormImage, setProjFormImage] = useState('');
  const [projFormLiveUrl, setProjFormLiveUrl] = useState('');
  const [projFormClient, setProjFormClient] = useState('');
  const [projFormYear, setProjFormYear] = useState('2025');
  const [projFormTags, setProjFormTags] = useState('Three.js, React, WebGL');
  const [projFormFeatured, setProjFormFeatured] = useState(true);
  const [projForm3dUrl, setProjForm3dUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Article Modal State
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [artTitle, setArtTitle] = useState('');
  const [artCategory, setArtCategory] = useState('3D Web');
  const [artExcerpt, setArtExcerpt] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artAuthor, setArtAuthor] = useState('Sudeep Tharu');
  const [artImage, setArtImage] = useState('/assets/aurora-3d.png');

  // Media state
  const [uploadedMediaList, setUploadedMediaList] = useState<string[]>([
    '/assets/heritages-roofing.png',
    '/assets/lumian.png',
    '/assets/virtual-zentra-tech.jpeg',
    '/assets/velora-motors.png',
    '/assets/summit-creative.png',
    '/assets/flowly.png',
    '/assets/aurora-3d.png',
    '/assets/nexus-ai-design.png',
    '/assets/zentra-tech.png',
    '/assets/about.png',
  ]);

  // Verify auth on mount
  useEffect(() => {
    async function checkAuth() {
      setIsCheckingAuth(true);
      const valid = await verifyOwnerApi();
      setIsAuthenticated(valid);
      setIsCheckingAuth(false);
      if (valid) {
        loadData();
      }
    }
    checkAuth();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3000);
  };

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [leadsRes, projectsRes, articlesRes, settingsRes] = await Promise.allSettled([
        fetchLeadsApi(),
        fetchProjectsApi(),
        fetchArticlesApi(),
        fetchSettingsApi(),
      ]);

      if (leadsRes.status === 'fulfilled') setLeads(leadsRes.value);
      if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value);
      if (articlesRes.status === 'fulfilled') setArticles(articlesRes.value);
      if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await loginOwnerApi(loginEmail, loginPassword);
      setIsAuthenticated(true);
      showToast('Owner session verified. Welcome back, Sudeep!');
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logoutOwnerApi();
    setIsAuthenticated(false);
    showToast('Logged out of owner console.');
  };

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLeadStatusApi(leadId, newStatus);
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      showToast(`Lead status updated to ${newStatus}`);
    } catch (err) {
      showToast('Failed to update lead status');
    }
  };

  // Open Create/Edit Project Modal
  const openProjectModal = (proj?: ProjectItem) => {
    if (proj) {
      setEditingProject(proj);
      setProjFormTitle(proj.title);
      setProjFormCategory(proj.category);
      setProjFormSubtitle(proj.subtitle);
      setProjFormDesc(proj.description);
      setProjFormImage(proj.image);
      setProjFormLiveUrl(proj.liveUrl || '');
      setProjFormClient(proj.client || '');
      setProjFormYear(proj.year || '2025');
      setProjFormTags(proj.tags.join(', '));
      setProjFormFeatured(proj.featured);
      setProjForm3dUrl(proj.model3dUrl || '');
    } else {
      setEditingProject(null);
      setProjFormTitle('');
      setProjFormCategory('3D');
      setProjFormSubtitle('');
      setProjFormDesc('');
      setProjFormImage('/assets/heritages-roofing.png');
      setProjFormLiveUrl('');
      setProjFormClient('');
      setProjFormYear('2025');
      setProjFormTags('Three.js, React, WebGL');
      setProjFormFeatured(true);
      setProjForm3dUrl('');
    }
    setShowProjectModal(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projFormTitle.trim()) {
      showToast('Please provide a project title');
      return;
    }

    const payload: Partial<ProjectItem> = {
      title: projFormTitle.trim(),
      category: projFormCategory,
      subtitle: projFormSubtitle.trim() || 'Next-gen digital experience.',
      description: projFormDesc.trim() || 'Custom engineered for high conversion and brand excellence.',
      image: projFormImage || '/assets/zentra-tech.png',
      liveUrl: projFormLiveUrl.trim() || undefined,
      client: projFormClient.trim() || 'Enterprise Client',
      year: projFormYear.trim() || '2025',
      tags: projFormTags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: projFormFeatured,
      model3dUrl: projForm3dUrl.trim() || undefined,
    };

    try {
      if (editingProject) {
        const updated = await updateProjectApi(editingProject.id, payload);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast(`Project "${updated.title}" updated`);
      } else {
        const created = await createProjectApi(payload);
        setProjects((prev) => [created, ...prev]);
        showToast(`Project "${created.title}" published`);
      }
      setShowProjectModal(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save project';
      showToast(msg);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteProjectApi(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast(`Project "${title}" deleted`);
    } catch (err) {
      showToast('Failed to delete project');
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim()) return;

    try {
      const newArt: Partial<ArticleItem> = {
        title: artTitle.trim(),
        category: artCategory,
        excerpt: artExcerpt.trim() || 'Article published through Zentra CMS.',
        content: artContent.trim() || 'Comprehensive industry analysis and architectural findings.',
        readTime: '5 min read',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        author: artAuthor.trim() || 'Sudeep Tharu',
        image: artImage || '/assets/aurora-3d.png',
        published: true,
      };

      const saved = await createArticleApi(newArt);
      setArticles((prev) => [saved, ...prev]);
      setShowArticleModal(false);
      showToast(`Article "${saved.title}" published`);
    } catch (err) {
      showToast('Failed to publish article');
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!window.confirm(`Delete article "${title}"?`)) return;
    try {
      await deleteArticleApi(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast(`Article deleted`);
    } catch (err) {
      showToast('Failed to delete article');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'project' | 'media' | 'article') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadMediaApi(file);
      if (target === 'project') {
        setProjFormImage(res.url);
      } else if (target === 'article') {
        setArtImage(res.url);
      }
      setUploadedMediaList((prev) => [res.url, ...prev]);
      showToast(`File uploaded: ${res.filename}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      showToast(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const saved = await saveSettingsApi(settings);
      setSettings(saved);
      showToast('Agency settings saved to database.');
    } catch (err) {
      showToast('Failed to save settings');
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesFilter = leadStatusFilter === 'All' || l.status === leadStatusFilter;
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Contacted':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Closed':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  /* --------------------------------------------------------------------------
     LOGIN GATE (Unauthenticated View)
     -------------------------------------------------------------------------- */
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#050711] flex items-center justify-center text-slate-300">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Verifying owner session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050711] text-slate-200 flex flex-col justify-between p-6">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full pt-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-black text-sm shadow-lg shadow-cyan-500/20">
              Z
            </div>
            <span className="font-display font-bold text-white tracking-wide text-xl">
              ZENTRA <span className="text-xs font-mono text-cyan-400 ml-1">CONSOLE</span>
            </span>
          </div>
          <button
            onClick={onExitDashboard}
            className="text-xs text-slate-400 hover:text-white px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            ← Back to Public Website
          </button>
        </div>

        <div className="max-w-md w-full mx-auto my-auto p-8 rounded-2xl bg-[#090e20] border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">Owner Access</h1>
            <p className="text-xs text-slate-400">
              Enter your credentials to manage agency leads, projects, and CMS settings.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                Owner Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="tharusudeep242@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                Master Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Zentra Console</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
            <span className="text-[11px] text-slate-500">
              Protected by Supabase Auth with HMAC-SHA256 owner session verification.
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-600 pb-4">
          Zentra Tech Digital Agency Platform · Enterprise Security Architecture
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     AUTHENTICATED ADMIN CONSOLE
     -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#050711] text-slate-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-900/90 to-cyan-900/90 border border-cyan-400/50 text-white text-xs font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar for Admin */}
      <header className="h-16 border-b border-white/[0.08] bg-[#070b18]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-black text-sm shadow-md shadow-cyan-500/20">
            Z
          </div>
          <span className="font-display font-bold text-white tracking-wide text-lg">
            ZENTRA <span className="text-xs font-mono text-cyan-400 ml-1">CONSOLE</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Refresh database records"
            disabled={isRefreshing}
            className="p-2 rounded-lg text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={onExitDashboard}
            className="text-xs text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            Public Site
          </button>

          <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-xs font-bold">
              ST
            </div>
            <div className="hidden sm:block text-left text-xs">
              <span className="block font-semibold text-white leading-tight">Sudeep Tharu</span>
              <span className="block text-[10px] text-cyan-400 font-mono">Agency Owner</span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-white/[0.08] bg-[#060a16] min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Management
            </div>
            {dashboardTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'leads' && leads.filter((l) => l.status === 'New').length > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-bold">
                      {leads.filter((l) => l.status === 'New').length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Stats */}
          <div className="p-3.5 rounded-xl bg-[#0a0f22] border border-white/[0.06] text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Database</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Connected
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Active Leads</span>
              <span className="text-white font-mono font-semibold">{leads.length}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Live Projects</span>
              <span className="text-white font-mono font-semibold">{projects.length}</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
          {/* Mobile Tab Pills */}
          <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-white/10">
            {dashboardTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'bg-white/5 text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white font-display">Executive Overview</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Real-time agency KPIs, client pipeline, and portfolio status.
                </p>
              </div>

              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-[#090e1f] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enquiries</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono tabular-nums">{leads.length}</div>
                  <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{leads.filter((l) => l.status === 'New').length} new pending review</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#090e1f] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Case Studies</span>
                    <FolderKanban className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono tabular-nums">{projects.length}</div>
                  <div className="text-[11px] text-sky-400 flex items-center gap-1 font-medium">
                    <span>{projects.filter((p) => p.featured).length} featured on homepage</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#090e1f] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Published Articles</span>
                    <FileText className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono tabular-nums">{articles.length || 3}</div>
                  <div className="text-[11px] text-purple-400 flex items-center gap-1 font-medium">
                    <span>Active in Insights section</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#090e1f] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Response SLA</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono tabular-nums">&lt; 24h</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <span>Resend dispatch active</span>
                  </div>
                </div>
              </div>

              {/* Recent Leads Preview */}
              <div className="p-6 rounded-2xl bg-[#090e1f] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Recent Client Enquiries</h3>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    View All Enquiries →
                  </button>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {leads.slice(0, 4).map((lead) => (
                    <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{lead.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusBadge(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-3">
                          <span>{lead.email}</span>
                          <span>·</span>
                          <span className="text-cyan-400/90">{lead.service}</span>
                          {lead.budget && (
                            <>
                              <span>·</span>
                              <span className="text-slate-300 font-mono">{lead.budget}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                          className="text-xs bg-[#060a16] border border-white/10 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-cyan-400"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLIENT ENQUIRIES */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">Client Enquiries & Leads</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Incoming project requests submitted through the contact form and project wizard.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Filter */}
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value as LeadStatus | 'All')}
                    className="text-xs bg-[#090e1f] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-2 rounded-xl bg-[#090e1f] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44 sm:w-56"
                    />
                  </div>
                </div>
              </div>

              {/* Leads Table */}
              <div className="rounded-2xl bg-[#090e1f] border border-white/[0.08] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c142b] border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">Client</th>
                        <th className="py-3.5 px-4">Service</th>
                        <th className="py-3.5 px-4">Budget / Timeline</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-slate-300">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-500">
                            No client leads found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-semibold text-white text-sm">{lead.name}</div>
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                {lead.email}
                              </a>
                            </td>
                            <td className="py-4 px-4 font-medium text-slate-200">
                              {lead.service}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-mono text-slate-300">{lead.budget || 'Not specified'}</div>
                              {lead.timeline && <div className="text-[10px] text-slate-500">{lead.timeline}</div>}
                            </td>
                            <td className="py-4 px-4">
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                                className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border focus:outline-none ${getStatusBadge(
                                  lead.status
                                )}`}
                              >
                                <option value="New" className="bg-[#070b18] text-white">New</option>
                                <option value="Contacted" className="bg-[#070b18] text-white">Contacted</option>
                                <option value="In Progress" className="bg-[#070b18] text-white">In Progress</option>
                                <option value="Closed" className="bg-[#070b18] text-white">Closed</option>
                              </select>
                            </td>
                            <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                              {lead.date}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-medium border border-white/10 transition-colors"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS CMS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">Projects & Case Studies</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Add, edit, upload assets, and feature projects on the public showcase.
                  </p>
                </div>

                <button
                  onClick={() => openProjectModal()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-2xl bg-[#090e1f] border border-white/[0.08] overflow-hidden flex flex-col justify-between group hover:border-cyan-500/30 transition-all shadow-lg shadow-black/40"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        <img
                          src={getAssetUrl(proj.image)}
                          alt={proj.title}
                          onError={(e) => handleImageFallback(e)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
                          {proj.category}
                        </div>
                        {proj.featured && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-blue-600/80 backdrop-blur-md text-[10px] font-semibold text-white">
                            Featured
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {proj.subtitle}
                        </p>
                        <div className="pt-2 flex flex-wrap gap-1">
                          {proj.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[10px] text-slate-400 font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-white/[0.06] mt-4 pt-3 text-xs">
                      <span className="text-slate-500 font-mono text-[11px]">{proj.year || '2025'}</span>
                      <div className="flex items-center gap-2">
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 transition-colors"
                            title="Live URL"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => openProjectModal(proj)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ARTICLES CMS */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">Blog & Insights CMS</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Publish articles, case breakdown essays, and industry guides.
                  </p>
                </div>

                <button
                  onClick={() => setShowArticleModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write New Article</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(articles.length > 0 ? articles : [
                  {
                    id: 'art-1',
                    title: 'The Rise of Real-Time 3D in Modern Web Experiences',
                    category: '3D Web',
                    excerpt: 'How WebGL and WebGPU are transforming flat web interfaces into tactile, high-conversion spatial journeys.',
                    author: 'Ajibh Dahal',
                    date: 'Oct 15, 2025',
                    image: '/assets/aurora-3d.png',
                  },
                  {
                    id: 'art-2',
                    title: 'Designing for AI: The Evolution of Autonomous UI',
                    category: 'AI & Design',
                    excerpt: 'Moving beyond static chatboxes to ambient, contextual AI agents embedded directly in product workflows.',
                    author: 'Bikrant Wilson',
                    date: 'Oct 08, 2025',
                    image: '/assets/nexus-ai-design.png',
                  },
                  {
                    id: 'art-3',
                    title: 'From Concept to Conversion: Why Aesthetic Matters in 2025',
                    category: 'Strategy',
                    excerpt: 'Empirical data on how premium craft, micro-interactions, and visual storytelling amplify enterprise deal velocity.',
                    author: 'Sudeep Tharu',
                    date: 'Sep 29, 2025',
                    image: '/assets/zentra-tech.png',
                  },
                ]).map((art) => (
                  <div key={art.id} className="rounded-2xl bg-[#090e1f] border border-white/[0.08] overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="aspect-video bg-slate-900 overflow-hidden relative">
                        <img
                          src={getAssetUrl(art.image)}
                          alt={art.title}
                          onError={(e) => handleImageFallback(e)}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-cyan-300">
                          {art.category}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="text-sm font-bold text-white line-clamp-2">{art.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-3">{art.excerpt}</p>
                      </div>
                    </div>
                    <div className="p-5 pt-0 flex items-center justify-between border-t border-white/[0.06] text-xs text-slate-400 mt-3 pt-3">
                      <span>By {art.author}</span>
                      <button
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        className="text-slate-500 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">Media Library</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Upload and manage project cover images, case study galleries, and 3D assets.
                  </p>
                </div>

                <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'media')}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {uploadedMediaList.map((mediaUrl, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl overflow-hidden bg-slate-900 border border-white/10 aspect-square"
                  >
                    <img
                      src={getAssetUrl(mediaUrl)}
                      alt="Media asset"
                      onError={(e) => handleImageFallback(e)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(mediaUrl);
                          showToast('Asset URL copied to clipboard');
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-500 text-black text-[11px] font-semibold"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AGENCY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-2xl font-bold text-white font-display">Agency Settings</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Configure verified corporate contact details, turnaround SLAs, and metadata.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 rounded-2xl bg-[#090e1f] border border-white/[0.08] p-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Agency Brand Name
                  </label>
                  <input
                    type="text"
                    value={settings?.agencyName || 'Zentra Tech'}
                    onChange={(e) => setSettings((s) => s ? { ...s, agencyName: e.target.value } : null)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Corporate Tagline
                  </label>
                  <input
                    type="text"
                    value={settings?.tagline || 'Next-Gen Digital Agency & 3D Web Studio'}
                    onChange={(e) => setSettings((s) => s ? { ...s, tagline: e.target.value } : null)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings?.contactEmail || 'zentratech11@gmail.com'}
                      onChange={(e) => setSettings((s) => s ? { ...s, contactEmail: e.target.value } : null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings?.contactPhone || '+1 (555) 019-2834'}
                      onChange={(e) => setSettings((s) => s ? { ...s, contactPhone: e.target.value } : null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Physical Studio / Headquarters
                  </label>
                  <input
                    type="text"
                    value={settings?.officeLocation || 'San Francisco, CA & Global Digital Studio'}
                    onChange={(e) => setSettings((s) => s ? { ...s, officeLocation: e.target.value } : null)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Turnaround SLA Notice
                  </label>
                  <input
                    type="text"
                    value={settings?.consultationTurnaround || 'Within 24 business hours'}
                    onChange={(e) => setSettings((s) => s ? { ...s, consultationTurnaround: e.target.value } : null)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/25"
                >
                  Save Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: SYSTEM & SECURITY */}
          {activeTab === 'system' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-2xl font-bold text-white font-display">System & Security Audit</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Verified security architecture, environment integrations, and authentication state.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl bg-[#090e1f] border border-white/[0.08] space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Persistence & Database</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Hybrid storage architecture with Supabase PostgreSQL connection support and automated, atomic local JSON fallback.
                  </p>
                  <div className="text-xs space-y-2 pt-2 border-t border-white/[0.06]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Persistence Engine:</span>
                      <span className="text-cyan-400 font-mono">Hybrid Storage</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Enquiries Table:</span>
                      <span className="text-emerald-400 font-mono">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Projects Table:</span>
                      <span className="text-emerald-400 font-mono">Active</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#090e1f] border border-white/[0.08] space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Email Dispatch (Resend)</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Client enquiry notification pipeline. Integrates live Resend API delivery when key is supplied, with safe server console logging fallback.
                  </p>
                  <div className="text-xs space-y-2 pt-2 border-t border-white/[0.06]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dispatcher Status:</span>
                      <span className="text-emerald-400 font-mono">Operational</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Spam Guard Honeypot:</span>
                      <span className="text-emerald-400 font-mono">Enforced</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#090e1f] border border-white/[0.08] space-y-3">
                <h3 className="text-sm font-bold text-white">Active Owner Session</h3>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Authenticated Owner: <span className="text-white font-mono">tharusudeep242@gmail.com</span></div>
                  <div>Authorization Type: <span className="text-cyan-400 font-mono">Bearer HMAC-SHA256 Token</span></div>
                  <div>Role Permissions: <span className="text-emerald-400 font-mono">Owner / SuperAdmin</span></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* INSPECT LEAD MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090e22] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Enquiry Details</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Client</span>
                <span className="text-white text-sm font-semibold">{selectedLead.name}</span>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Email</span>
                <a href={`mailto:${selectedLead.email}`} className="text-cyan-400 hover:underline">
                  {selectedLead.email}
                </a>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Requested Service</span>
                <span className="text-slate-200">{selectedLead.service}</span>
              </div>

              {selectedLead.budget && (
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Estimated Budget</span>
                  <span className="text-slate-200 font-mono">{selectedLead.budget}</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Message</span>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-slate-200 whitespace-pre-wrap mt-1">
                  {selectedLead.message}
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Status</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as LeadStatus;
                    handleUpdateStatus(selectedLead.id, newStatus);
                    setSelectedLead({ ...selectedLead, status: newStatus });
                  }}
                  className={`mt-1 text-xs font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none ${getStatusBadge(
                    selectedLead.status
                  )}`}
                >
                  <option value="New" className="bg-[#070b18] text-white">New</option>
                  <option value="Contacted" className="bg-[#070b18] text-white">Contacted</option>
                  <option value="In Progress" className="bg-[#070b18] text-white">In Progress</option>
                  <option value="Closed" className="bg-[#070b18] text-white">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <a
                href={`mailto:${selectedLead.email}?subject=Regarding your enquiry with Zentra Tech`}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold text-xs flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> Reply to Client
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PROJECT MODAL */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#090e22] border border-white/15 rounded-2xl max-w-xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={projFormTitle}
                  onChange={(e) => setProjFormTitle(e.target.value)}
                  placeholder="Project Name"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={projFormCategory}
                    onChange={(e) => setProjFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="3D">3D</option>
                    <option value="Websites">Websites</option>
                    <option value="Branding">Branding</option>
                    <option value="Apps">Apps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Year</label>
                  <input
                    type="text"
                    value={projFormYear}
                    onChange={(e) => setProjFormYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subtitle</label>
                <input
                  type="text"
                  value={projFormSubtitle}
                  onChange={(e) => setProjFormSubtitle(e.target.value)}
                  placeholder="Website & 3D Experience built for performance."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cover Image Path / Upload</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={projFormImage}
                    onChange={(e) => setProjFormImage(e.target.value)}
                    placeholder="/assets/heritages-roofing.png"
                    className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 cursor-pointer text-xs flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'project')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Live URL (optional)</label>
                <input
                  type="text"
                  value={projFormLiveUrl}
                  onChange={(e) => setProjFormLiveUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">3D Model URL / Asset (optional)</label>
                <input
                  type="text"
                  value={projForm3dUrl}
                  onChange={(e) => setProjForm3dUrl(e.target.value)}
                  placeholder="Procedural or /models/asset.glb"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={projFormTags}
                  onChange={(e) => setProjFormTags(e.target.value)}
                  placeholder="Three.js, React, GLSL"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={projFormFeatured}
                  onChange={(e) => setProjFormFeatured(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-cyan-400"
                />
                <label htmlFor="featuredToggle" className="text-slate-300 text-xs">
                  Feature this project on public homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20"
                >
                  {editingProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ARTICLE MODAL */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090e22] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Publish New Article</h3>
              <button
                onClick={() => setShowArticleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  placeholder="Article Headline"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Author</label>
                  <input
                    type="text"
                    value={artAuthor}
                    onChange={(e) => setArtAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Excerpt</label>
                <textarea
                  rows={2}
                  value={artExcerpt}
                  onChange={(e) => setArtExcerpt(e.target.value)}
                  placeholder="Brief summary shown on listing cards..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Content</label>
                <textarea
                  rows={4}
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  placeholder="Article body content..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
