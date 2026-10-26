import React, { useState } from 'react';
import { Layers, Twitter, Linkedin, Github, ArrowUpRight, X } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenProjectModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenProjectModal }) => {
  const [legalModal, setLegalModal] = useState<{ title: string; content: string } | null>(null);

  const openLegalModal = (type: 'privacy' | 'terms' | 'cookies') => {
    switch (type) {
      case 'privacy':
        setLegalModal({
          title: 'Privacy Policy',
          content:
            'Zentra Tech is committed to safeguarding client privacy and intellectual property. All project enquiries, proprietary briefs, and client data are transmitted securely via encrypted channels and never sold or shared with third parties.',
        });
        break;
      case 'terms':
        setLegalModal({
          title: 'Terms of Service',
          content:
            'Standard master services terms apply to all digital production, 3D WebGL engineering, and brand architecture deliverables. Intellectual property transfers upon final milestone delivery and payment.',
        });
        break;
      case 'cookies':
        setLegalModal({
          title: 'Cookie Notice',
          content:
            'We strictly use essential cookies required for session management and user preferences. We do not use intrusive third-party cross-site tracking cookies.',
        });
        break;
    }
  };

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
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors text-left">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors text-left">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('work')} className="hover:text-cyan-400 transition-colors text-left">
                  Featured Work
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-cyan-400 transition-colors text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('insights')} className="hover:text-cyan-400 transition-colors text-left">
                  Insights & Articles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors text-left text-xs text-slate-500 hover:text-slate-300">
                  Owner Console
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
                className="px-6 py-2.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 Zentra Tech. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => openLegalModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => openLegalModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => openLegalModal('cookies')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>

      {/* Polite Legal Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-2xl bg-[#090e1f] border border-white/15 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white">{legalModal.title}</h3>
              <button
                onClick={() => setLegalModal(null)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {legalModal.content}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black text-xs font-semibold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
