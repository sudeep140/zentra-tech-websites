import React from 'react';
import { X, ExternalLink, Calendar, User, Tag, Sparkles, Award } from 'lucide-react';
import { ProjectItem } from '../types/index.js';
import { getAssetUrl, handleImageFallback } from '../utils/assets.js';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenInquiry: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onOpenInquiry,
}) => {
  if (!project) return null;

  const resolvedLiveUrl = project.liveUrl
    ? project.liveUrl.startsWith('http')
      ? project.liveUrl
      : `https://${project.liveUrl}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="max-w-3xl w-full rounded-3xl bg-[#080d1d] border border-cyan-500/30 overflow-hidden shadow-2xl space-y-6 my-8">
        {/* Banner with close button */}
        <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
          <img
            src={getAssetUrl(project.image)}
            alt={project.title}
            onError={(e) => handleImageFallback(e)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d1d] via-transparent to-black/40" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-xs font-semibold text-cyan-300">
              {project.category}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 border-b border-white/[0.08] pb-4">
            {project.client && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Client: <strong className="text-white">{project.client}</strong></span>
              </div>
            )}
            {project.year && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Year: <strong className="text-white">{project.year}</strong></span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Project Overview
            </h3>
            <p className="text-base text-slate-200 leading-relaxed font-normal">
              {project.description}
            </p>
          </div>

          {/* Key Metrics / Highlights */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {project.metrics.map((m) => (
                <div key={m.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-2xl font-extrabold font-display text-cyan-400">{m.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Technologies & Deliverables
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => {
                onClose();
                onOpenInquiry(project.title);
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:scale-105 transition-transform cursor-pointer"
            >
              Request Similar Project
            </button>

            {resolvedLiveUrl ? (
              <a
                href={resolvedLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-white/[0.05] hover:bg-white/10 text-white text-xs font-semibold border border-white/10 inline-flex items-center gap-2 transition-colors"
              >
                <span>Visit Live Experience</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs text-slate-500 italic">
                Proprietary enterprise build
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
