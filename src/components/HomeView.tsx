import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, Sparkles, Monitor, Layers, Palette, Code2, ExternalLink } from 'lucide-react';
import { Hero3DScene } from './Hero3DScene.js';
import { SERVICES_DATA } from '../data/mockData.js';
import { ProjectItem, ServiceItem } from '../types/index.js';
import { getAssetUrl, handleImageFallback } from '../utils/assets.js';

interface HomeViewProps {
  projects: ProjectItem[];
  onNavigate: (tab: string) => void;
  onOpenProjectModal: () => void;
  onSelectProject: (project: ProjectItem) => void;
  onSelectService: (service: ServiceItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  projects,
  onNavigate,
  onOpenProjectModal,
  onSelectProject,
  onSelectService,
}) => {
  const [activeWorkFilter, setActiveWorkFilter] = useState<'All' | 'Websites' | '3D' | 'Branding' | 'Apps'>('All');

  const filteredProjects = activeWorkFilter === 'All'
    ? projects.slice(0, 4)
    : projects.filter((p) => p.category === activeWorkFilter).slice(0, 4);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-6 h-6 text-cyan-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-sky-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-purple-400" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-blue-400" />;
      default:
        return <Layers className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 lg:pt-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyan-500/15 blur-[150px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-widest uppercase shadow-sm shadow-cyan-500/20">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                DIGITAL AGENCY
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
                Build What’s{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  Next.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-300/90 max-w-xl font-normal leading-relaxed">
                We create stunning websites, immersive 3D experiences and intelligent automation to help your business grow.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenProjectModal}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-semibold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('work')}
                  className="px-7 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white font-semibold text-base border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                >
                  <span>Explore Our Work</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Stats Row */}
              <div className="pt-8 grid grid-cols-3 gap-6 max-w-lg border-t border-white/[0.08]">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">3+</div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">15+</div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Projects Delivered</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-display text-cyan-400">100%</div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Client Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Torus Sculpture */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <Hero3DScene />
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="flex justify-end pt-8 pr-4">
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
            >
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span>Scroll Down</span>
            </a>
          </div>
        </div>
      </section>

      {/* TRUSTED BY CLIENTS */}
      <section className="border-y border-white/[0.06] bg-[#070b16]/60 backdrop-blur-md py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Trusted by innovative businesses
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Notion */}
            <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-display font-semibold text-lg sm:text-xl">
              <div className="w-7 h-7 rounded border border-white/30 flex items-center justify-center font-serif text-sm">N</div>
              <span>Notion</span>
            </div>

            {/* Figma */}
            <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-display font-semibold text-lg sm:text-xl">
              <div className="w-5 h-7 rounded-sm bg-gradient-to-b from-purple-400 to-pink-500" />
              <span>Figma</span>
            </div>

            {/* Spotify */}
            <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-display font-semibold text-lg sm:text-xl">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-black">((</div>
              <span>Spotify</span>
            </div>

            {/* Netflix */}
            <div className="flex items-center gap-2 text-red-500 font-display font-black tracking-widest text-lg sm:text-xl">
              <span>NETFLIX</span>
            </div>

            {/* Adobe */}
            <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-display font-semibold text-lg sm:text-xl">
              <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              <span>Adobe</span>
            </div>

            {/* Google */}
            <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-display font-semibold text-lg sm:text-xl">
              <span className="font-bold text-lg sm:text-xl tracking-tight">Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO / SERVICES */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-bold tracking-widest uppercase text-cyan-400">
              WHAT WE DO
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Our Services
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              From concept to launch, we provide end-to-end digital solutions that help your brand stand out and perform.
            </p>
          </div>

          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5 Service Cards Grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {SERVICES_DATA.map((srv) => (
            <div
              key={srv.id}
              onClick={() => onSelectService(srv)}
              className="group relative p-6 rounded-2xl bg-[#090e1e]/80 border border-white/[0.08] hover:border-cyan-500/40 hover:bg-[#0c142b] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg shadow-black/40 hover:shadow-cyan-500/10"
            >
              {/* Subtle top glow highlight */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-cyan-950/70 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400/50 transition-all duration-300">
                  {getServiceIcon(srv.icon)}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {srv.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {srv.description}
                </p>
              </div>

              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO / FEATURED WORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-bold tracking-widest uppercase text-cyan-400">
              PORTFOLIO
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Featured Work
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Real projects. Real results. We partner with ambitious brands to create digital experiences that make an impact.
            </p>
          </div>

          <button
            onClick={() => onNavigate('work')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 group"
          >
            <span>View All Work</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Websites', '3D', 'Branding', 'Apps'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveWorkFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeWorkFilter === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4 Project Cards Grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer rounded-2xl bg-[#090e1e]/90 border border-white/[0.08] hover:border-cyan-500/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/11] overflow-hidden bg-slate-900">
                <img
                  src={getAssetUrl(project.image)}
                  alt={project.title}
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1e] via-transparent to-transparent opacity-80" />
                
                {/* Live Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-cyan-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Live
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {project.subtitle}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-medium border-t border-white/[0.06]">
                  <span className="text-slate-300">{project.category}</span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    View Project <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BOTTOM BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#0a1226] via-[#091024] to-[#060a16] shadow-2xl shadow-cyan-950/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">
              COLLABORATE WITH US
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Ready to elevate your digital presence?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Let's create an immersive experience that sets your brand apart and drives real revenue.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onOpenProjectModal}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-semibold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 rounded-full bg-white/[0.05] hover:bg-white/10 text-white font-semibold text-base border border-white/10 transition-all"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
