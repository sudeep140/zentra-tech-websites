import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Filter } from 'lucide-react';
import { ProjectItem } from '../types/index.js';

interface WorkViewProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenProjectModal: () => void;
}

export const WorkView: React.FC<WorkViewProps> = ({ projects, onSelectProject, onOpenProjectModal }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Websites' | '3D' | 'Branding' | 'Apps'>('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-16 sm:space-y-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          OUR WORK
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Our Work
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
          Explore our latest projects and see how we turn ambitious ideas into powerful, high-performance digital experiences.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>
        {(['All', 'Websites', '3D', 'Branding', 'Apps'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
          Showing {filteredProjects.length} projects
        </span>
      </div>

      {/* Projects Grid: 2-column large cards matching top right panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group cursor-pointer rounded-2xl bg-[#090e1e]/90 border border-white/[0.08] hover:border-cyan-500/50 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/15 flex flex-col"
          >
            {/* Image Banner */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090e1e] via-[#090e1e]/20 to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="px-3 py-1 rounded-full bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </h3>
                <p className="text-sm text-slate-300/90 leading-relaxed">
                  {project.subtitle}
                </p>
                <p className="text-xs text-slate-400 line-clamp-2 pt-1">
                  {project.description}
                </p>
              </div>

              {/* Tags and Action */}
              <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md bg-white/[0.04] text-[11px] font-medium text-slate-400 border border-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 inline-flex items-center gap-1">
                  <span>View Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Footer */}
      <div className="rounded-3xl p-8 sm:p-12 border border-white/[0.08] bg-[#070b17] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h3 className="text-2xl font-bold text-white">Have a custom vision in mind?</h3>
          <p className="text-sm text-slate-400 mt-1">We can craft a bespoke experience tailored to your exact industry and goals.</p>
        </div>
        <button
          onClick={onOpenProjectModal}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 whitespace-nowrap"
        >
          Start Your Project
        </button>
      </div>
    </div>
  );
};
