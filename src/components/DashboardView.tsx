import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Wrench,
  FileText,
  Image,
  Settings,
  UserCheck,
  History,
  LogOut,
  TrendingUp,
  Plus,
  Mail,
  ChevronDown,
  Calendar,
  Check,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import { ARTICLES_DATA, SERVICES_DATA, TEAM_MEMBERS } from '../data/mockData.js';
import { LeadItem, LeadStatus, ProjectItem } from '../types/index.js';

type DashboardTab =
  | 'dashboard'
  | 'leads'
  | 'projects'
  | 'services'
  | 'articles'
  | 'media'
  | 'users'
  | 'audit-logs'
  | 'settings';

interface DashboardViewProps {
  leads: LeadItem[];
  projects: ProjectItem[];
  onUpdateLeadStatus: (id: string, newStatus: LeadStatus) => void;
  onAddProject: (project: ProjectItem) => void;
  onExitDashboard: () => void;
}

const dashboardTabs: { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'users', label: 'Users', icon: UserCheck },
  { id: 'audit-logs', label: 'Audit Logs', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  projects,
  onUpdateLeadStatus,
  onAddProject,
  onExitDashboard,
}) => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<DashboardTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState<'Websites' | '3D' | 'Branding' | 'Apps'>('3D');
  const [newProjectSubtitle, setNewProjectSubtitle] = useState('');

  // Status badge styling helper
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Contacted':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'In Progress':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Closed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newProjectTitle.trim();
    if (!title) return;

    const project: ProjectItem = {
      id: `proj-${Date.now()}`,
      title,
      category: newProjectCategory,
      subtitle: newProjectSubtitle || 'Digital experience delivered with precision.',
      description: 'Created through Zentra Admin Console.',
      tags: [newProjectCategory, 'React', 'Tailwind'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      client: 'Enterprise Partner',
      year: '2025',
    };

    onAddProject(project);
    setShowAddProjectModal(false);
    setNewProjectTitle('');
    setNewProjectSubtitle('');
  };

  const filteredLeads = leads.filter((l) => {
    const matchesFilter = leadStatusFilter === 'All' || l.status === leadStatusFilter;
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050711] text-slate-200">
      {/* Top Bar for Admin */}
      <div className="h-16 border-b border-white/[0.08] bg-[#070b18]/90 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-black text-sm">
            Z
          </div>
          <span className="font-display font-bold text-white tracking-wide text-lg">
            ZENTRA <span className="text-xs font-normal text-cyan-400 ml-1">CONSOLE</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onExitDashboard}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
          >
            Back to Public Site
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold text-white">Admin</span>
              <span className="block text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar matching screenshot */}
        <aside className="w-64 border-r border-white/[0.08] bg-[#060a16] min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="space-y-6">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSidebarTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('leads')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarTab === 'leads'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Leads</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold">
                  {leads.length}
                </span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('projects')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarTab === 'projects'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span>Projects</span>
              </button>

              <div className="pt-4 pb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Management
              </div>

              <button
                onClick={() => setActiveSidebarTab('services')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarTab === 'services' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Services</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('articles')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarTab === 'articles' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Articles</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('media')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarTab === 'media' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Media</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('users')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarTab === 'users' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Users</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('audit-logs')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarTab === 'audit-logs' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Audit Logs</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-white/[0.08]">
            <button
              onClick={onExitDashboard}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
          <nav aria-label="Dashboard sections" className="md:hidden flex gap-2 overflow-x-auto pb-2">
            {dashboardTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSidebarTab(id)}
                className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                  activeSidebarTab === id ? 'bg-blue-600 text-white' : 'bg-white/[0.04] text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                {dashboardTabs.find((tab) => tab.id === activeSidebarTab)?.label}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {activeSidebarTab === 'dashboard'
                  ? "Good morning, Admin 👋 Here's what's happening with your business today."
                  : `Manage your ${dashboardTabs.find((tab) => tab.id === activeSidebarTab)?.label.toLowerCase()} from this workspace.`}
              </p>
            </div>

            {['dashboard', 'projects'].includes(activeSidebarTab) && <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>}
          </div>

          {activeSidebarTab === 'dashboard' ? (
            <>
          {/* 4 Metric KPI Cards matching screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Leads */}
            <div className="p-6 rounded-2xl bg-[#090e1f]/90 border border-white/[0.08] space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Leads
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-display text-white">
                  {leads.length}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
            </div>

            {/* Active Projects */}
            <div className="p-6 rounded-2xl bg-[#090e1f]/90 border border-white/[0.08] space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Published Projects
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-display text-white">{projects.length}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +15%
                </span>
              </div>
            </div>

            {/* Published Articles */}
            <div className="p-6 rounded-2xl bg-[#090e1f]/90 border border-white/[0.08] space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Published Articles
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-display text-white">{ARTICLES_DATA.length}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +25%
                </span>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="p-6 rounded-2xl bg-[#090e1f]/90 border border-white/[0.08] space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-display text-white">$84,500</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +22%
                </span>
              </div>
            </div>
          </div>

          {/* Two-Column: Leads Overview Chart & Recent Leads matching screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Leads Overview Chart */}
            <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-[#090e1f]/90 border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Leads Overview</h3>
                  <p className="text-xs text-slate-400">Inbound inquiries across 2025</p>
                </div>
                <div className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/20">
                  Jan - Aug 2025
                </div>
              </div>

              {/* Chart SVG */}
              <div className="relative pt-6 pb-2">
                <svg viewBox="0 0 500 200" className="w-full h-48 sm:h-56 overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="4 4" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="4 4" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="4 4" />

                  {/* Area fill */}
                  <path
                    d="M 20 160 Q 80 140, 130 110 T 250 80 T 360 60 T 470 30 L 470 180 L 20 180 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Spline stroke */}
                  <path
                    d="M 20 160 Q 80 140, 130 110 T 250 80 T 360 60 T 470 30"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Nodes */}
                  {[
                    { cx: 20, cy: 160, label: 'Jan: 4' },
                    { cx: 85, cy: 140, label: 'Feb: 6' },
                    { cx: 150, cy: 105, label: 'Mar: 10' },
                    { cx: 215, cy: 90, label: 'Apr: 13' },
                    { cx: 280, cy: 75, label: 'May: 16' },
                    { cx: 345, cy: 65, label: 'Jun: 18' },
                    { cx: 410, cy: 45, label: 'Jul: 21' },
                    { cx: 470, cy: 30, label: 'Aug: 24' },
                  ].map((node, i) => (
                    <g key={i} className="group/dot cursor-pointer">
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="5"
                        fill="#050711"
                        stroke="#00f0ff"
                        strokeWidth="2.5"
                        className="transition-transform group-hover/dot:scale-150"
                      />
                    </g>
                  ))}
                </svg>

                {/* X-Axis labels */}
                <div className="flex justify-between text-[11px] font-medium text-slate-400 pt-2 px-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                </div>
              </div>
            </div>

            {/* Right: Recent Leads matching screenshot */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-[#090e1f]/90 border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Recent Leads</h3>
                  <p className="text-xs text-slate-400">Click status to update pipeline</p>
                </div>
                <button
                  onClick={() => setActiveSidebarTab('leads')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  View All
                </button>
              </div>

              {/* Leads List */}
              <div className="space-y-3">
                {leads.slice(0, 5).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {lead.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{lead.name}</p>
                        <p className="text-xs text-slate-400 truncate">{lead.email}</p>
                      </div>
                    </div>

                    {/* Status Pill with Dropdown selection */}
                    <div className="relative shrink-0">
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer focus:outline-none ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        <option value="New" className="bg-[#090e1f] text-blue-300">New</option>
                        <option value="Contacted" className="bg-[#090e1f] text-cyan-300">Contacted</option>
                        <option value="In Progress" className="bg-[#090e1f] text-amber-300">In Progress</option>
                        <option value="Closed" className="bg-[#090e1f] text-emerald-300">Closed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions matching screenshot */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#090e1f]/90 border border-white/[0.08] space-y-4">
            <h3 className="text-lg font-bold text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="p-4 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.08] hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FolderKanban className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-cyan-300">Add Project</div>
                <div className="text-xs text-slate-400 mt-0.5">Publish showcase work</div>
              </button>

              <button
                onClick={() => setActiveSidebarTab('services')}
                className="p-4 rounded-xl bg-white/[0.03] hover:bg-sky-500/10 border border-white/[0.08] hover:border-sky-500/40 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-950/60 border border-sky-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Wrench className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-sky-300">Add Service</div>
                <div className="text-xs text-slate-400 mt-0.5">Expand offerings</div>
              </button>

              <button
                onClick={() => setActiveSidebarTab('articles')}
                className="p-4 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/[0.08] hover:border-amber-500/40 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-amber-300">Write Article</div>
                <div className="text-xs text-slate-400 mt-0.5">Post thought leadership</div>
              </button>

              <button
                onClick={() => setActiveSidebarTab('media')}
                className="p-4 rounded-xl bg-white/[0.03] hover:bg-purple-500/10 border border-white/[0.08] hover:border-purple-500/40 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Image className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-purple-300">Upload Media</div>
                <div className="text-xs text-slate-400 mt-0.5">Assets & 3D models</div>
              </button>
            </div>
          </div>
            </>
          ) : (
            <section className="rounded-2xl bg-[#090e1f]/90 border border-white/[0.08] p-6 sm:p-8">
              {activeSidebarTab === 'leads' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search leads"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </label>
                    <select
                      value={leadStatusFilter}
                      onChange={(event) => setLeadStatusFilter(event.target.value as LeadStatus | 'All')}
                      className="px-3 py-2.5 rounded-xl bg-[#070c1a] border border-white/10 text-sm text-white"
                    >
                      <option>All</option>
                      <option>New</option>
                      <option>Contacted</option>
                      <option>In Progress</option>
                      <option>Closed</option>
                    </select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs uppercase text-slate-500 border-b border-white/[0.08]">
                        <tr><th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Email</th><th className="py-3 pr-4">Service</th><th className="py-3">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id}>
                            <td className="py-3 pr-4 text-white">{lead.name}</td>
                            <td className="py-3 pr-4 text-slate-400">{lead.email}</td>
                            <td className="py-3 pr-4 text-slate-400">{lead.service}</td>
                            <td className="py-3">
                              <select
                                value={lead.status}
                                onChange={(event) => onUpdateLeadStatus(lead.id, event.target.value as LeadStatus)}
                                className={`px-2.5 py-1 rounded-full border text-xs font-semibold bg-[#090e1f] ${getStatusBadge(lead.status)}`}
                              >
                                <option>New</option><option>Contacted</option><option>In Progress</option><option>Closed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredLeads.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No leads match your search.</p>}
                  </div>
                </div>
              )}

              {activeSidebarTab === 'projects' && (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <article key={project.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                      <img src={project.image} alt="" className="w-full aspect-video object-cover bg-slate-900" />
                      <div className="p-4">
                        <p className="text-xs text-cyan-400">{project.category}</p>
                        <h2 className="mt-1 font-semibold text-white">{project.title}</h2>
                        <p className="mt-1 text-xs text-slate-400">{project.subtitle}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activeSidebarTab === 'services' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {SERVICES_DATA.map((service) => (
                    <article key={service.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                      <h2 className="font-semibold text-white">{service.title}</h2>
                      <p className="mt-2 text-sm text-slate-400">{service.description}</p>
                      <ul className="mt-3 space-y-1 text-xs text-slate-500">
                        {service.features.map((feature) => <li key={feature}>• {feature}</li>)}
                      </ul>
                    </article>
                  ))}
                </div>
              )}

              {activeSidebarTab === 'articles' && (
                <div className="divide-y divide-white/[0.06]">
                  {ARTICLES_DATA.map((article) => (
                    <article key={article.id} className="py-4 first:pt-0 last:pb-0">
                      <p className="text-xs text-cyan-400">{article.category} · {article.date}</p>
                      <h2 className="mt-1 font-semibold text-white">{article.title}</h2>
                      <p className="mt-1 text-sm text-slate-400">{article.excerpt}</p>
                    </article>
                  ))}
                </div>
              )}

              {activeSidebarTab === 'media' && (
                <div className="space-y-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
                    <Plus className="w-4 h-4" />
                    Select media files
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.glb,.gltf"
                      className="sr-only"
                      onChange={(event) => {
                        const files = Array.from(event.target.files ?? []);
                        setUploadedMedia((current) => [...current, ...files.map((file) => file.name)]);
                        event.target.value = '';
                      }}
                    />
                  </label>
                  <p className="text-sm text-slate-400">Selected files are listed for this session. Configure storage to publish them to a shared media library.</p>
                  {uploadedMedia.length > 0 && (
                    <ul className="space-y-2">
                      {uploadedMedia.map((name, index) => <li key={`${name}-${index}`} className="rounded-lg bg-white/[0.03] px-3 py-2 text-sm text-slate-300">{name}</li>)}
                    </ul>
                  )}
                </div>
              )}

              {activeSidebarTab === 'users' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {TEAM_MEMBERS.map((member) => (
                    <article key={member.id} className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <img src={member.avatar} alt="" className="w-12 h-12 rounded-full object-cover bg-slate-800" />
                      <div><h2 className="font-semibold text-white">{member.name}</h2><p className="text-xs text-slate-400">{member.role}</p></div>
                    </article>
                  ))}
                </div>
              )}

              {activeSidebarTab === 'audit-logs' && (
                <div className="py-8 text-center">
                  <History className="mx-auto h-8 w-8 text-slate-500" />
                  <p className="mt-3 font-medium text-white">No audit events recorded</p>
                  <p className="mt-1 text-sm text-slate-400">Activity tracking is not configured for this demo.</p>
                </div>
              )}

              {activeSidebarTab === 'settings' && (
                <div className="max-w-xl space-y-4">
                  <div>
                    <h2 className="font-semibold text-white">Workspace settings</h2>
                    <p className="mt-1 text-sm text-slate-400">This dashboard is running in demo mode. Account and security settings are managed by your deployment configuration.</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Signed in as</p>
                    <p className="mt-1 text-sm text-white">Admin</p>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-2xl bg-[#090e1f] border border-cyan-500/30 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-bold text-white">Add New Showcase Project</h3>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close add project form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label htmlFor="project-title" className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Project Title *
                </label>
                <input
                  id="project-title"
                  type="text"
                  required
                  pattern=".*\S.*"
                  placeholder="e.g. CyberVault 3D"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="project-category" className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Category *
                </label>
                <select
                  id="project-category"
                  value={newProjectCategory}
                  onChange={(e) => {
                    const category = e.target.value;
                    if (category === 'Websites' || category === '3D' || category === 'Branding' || category === 'Apps') {
                      setNewProjectCategory(category);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070c1a] border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                >
                  <option value="3D">3D</option>
                  <option value="Websites">Websites</option>
                  <option value="Branding">Branding</option>
                  <option value="Apps">Apps</option>
                </select>
              </div>

              <div>
                <label htmlFor="project-subtitle" className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Short Subtitle
                </label>
                <input
                  id="project-subtitle"
                  type="text"
                  placeholder="Interactive 3D Web Experience built for scale."
                  value={newProjectSubtitle}
                  onChange={(e) => setNewProjectSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20"
                >
                  Create & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
