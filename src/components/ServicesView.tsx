import React from 'react';
import { Monitor, Layers, Sparkles, Palette, Code2, CheckCircle2, ArrowRight } from 'lucide-react';
import { SERVICES_DATA } from '../data/mockData.js';
import { ServiceItem } from '../types/index.js';

interface ServicesViewProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenProjectModalWithService: (serviceName: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onSelectService,
  onOpenProjectModalWithService,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-8 h-8 text-cyan-400" />;
      case 'Layers':
        return <Layers className="w-8 h-8 text-sky-400" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-amber-400" />;
      case 'Palette':
        return <Palette className="w-8 h-8 text-purple-400" />;
      case 'Code2':
        return <Code2 className="w-8 h-8 text-blue-400" />;
      default:
        return <Layers className="w-8 h-8 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          END-TO-END CAPABILITIES
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Our Services
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
          We combine cutting-edge creative direction with modern engineering to craft digital flagships that convert users and elevate brand perception.
        </p>
      </div>

      {/* Services List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES_DATA.map((service, index) => (
          <div
            key={service.id}
            className="rounded-3xl bg-[#090e1e]/90 border border-white/[0.08] hover:border-cyan-500/40 p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 group"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                  {getIcon(service.icon)}
                </div>
                <span className="text-4xl font-extrabold font-display text-white/10 group-hover:text-cyan-400/20 transition-colors">
                  0{index + 1}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Deliverables / Features */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold tracking-wider uppercase text-slate-400">
                  What’s Included:
                </div>
                {service.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={() => onSelectService(service)}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Full Details
              </button>
              <button
                onClick={() => onOpenProjectModalWithService(service.title)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 text-xs font-semibold transition-all"
              >
                <span>Request Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
