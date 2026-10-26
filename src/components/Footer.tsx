import React from 'react';
import { Layers, Twitter, Linkedin, Github, Dribbble, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenProjectModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenProjectModal }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#04060c] pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#070b16] rounded-[10px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-white">
                ZENTRA
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              We design and build future-proof digital flagships, interactive 3D web applications, and autonomous intelligent workflows.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors" aria-label="Dribbble">
                <Dribbble className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('work')} className="hover:text-cyan-400 transition-colors">
                  Featured Work
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-cyan-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('insights')} className="hover:text-cyan-400 transition-colors">
                  Insights & Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & CTA */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Get In Touch</h4>
            <p className="text-sm text-slate-400">
              Have a high-impact project? Let's discuss requirements and kickoff timelines.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenProjectModal}
                className="px-6 py-2.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 transition-all inline-flex items-center gap-2"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Line matching reference */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 Zentra Tech. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button onClick={() => alert('Privacy Policy: All customer data is encrypted and kept strictly confidential.')} className="hover:text-white transition-colors">
              Privacy
            </button>
            <button onClick={() => alert('Terms of Service: Standard digital engineering and agency master services terms apply.')} className="hover:text-white transition-colors">
              Terms
            </button>
            <button onClick={() => alert('Cookies: Strictly essential session and functional preferences only.')} className="hover:text-white transition-colors">
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
