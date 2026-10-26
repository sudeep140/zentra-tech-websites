import React from 'react';
import { Lightbulb, Users, Award, ShieldCheck, Twitter, Linkedin, Github, ArrowUpRight } from 'lucide-react';
import { Mission3DScene } from './Mission3DScene.js';
import { TEAM_MEMBERS } from '../data/mockData.js';
import { getAssetUrl, handleImageFallback } from '../utils/assets.js';

interface AboutViewProps {
  onOpenProjectModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenProjectModal }) => {
  return (
    <div className="space-y-24 sm:space-y-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden border border-white/8 bg-[#090e1f]/70 p-8 sm:p-14 lg:p-16">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            OUR STORY
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
           At Zentra Tech, we combine creativity, advanced technology, and strategic thinking to solve real business challenges.

From immersive 3D websites and premium digital experiences to intelligent AI-powered automation, we build tailored solutions that help ambitious businesses stand out, work smarter, and grow faster.
           </p>
        </div>

        {/* Studio interior banner shot */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-white/10 aspect-21/9 relative">
          <img
            src="/assets/about.png"
            alt="Zentra Design Studio"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/zentra-tech.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-slate-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Zentra Global Creative Studio
          </div>
        </div>
      </section>

      {/* OUR MISSION WITH 3D OBJECT */}
      <section className="relative rounded-3xl overflow-hidden border border-white/8 bg-[#080d1c]/80 p-8 sm:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: 3D sculpture */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <Mission3DScene />
          </div>

          {/* Right: Mission copy & stats */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">
                OUR MISSION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Empowering brands with timeless digital craft.
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                To help businesses grow through innovative technology, creative design and intelligent automation. We reject flat boring templates in favor of bespoke, unforgettable brand moments that convert.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/8">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">3+</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">15+</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">Projects Delivered</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-cyan-400">100%</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">
            WHAT WE STAND FOR
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Our Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Innovation */}
          <div className="p-7 rounded-2xl bg-[#090e1e]/80 border border-white/8 hover:border-cyan-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Innovation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We embrace new ideas and technologies, constantly pushing beyond conventions to give our clients an unfair competitive advantage.
            </p>
          </div>

          {/* Collaboration */}
          <div className="p-7 rounded-2xl bg-[#090e1e]/80 border border-white/[0.08] hover:border-cyan-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Collaboration</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We build strong partnerships. We act as an extension of your internal executive and product team, not an outsourced factory.
            </p>
          </div>

          {/* Excellence */}
          <div className="p-7 rounded-2xl bg-[#090e1e]/80 border border-white/[0.08] hover:border-cyan-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Excellence</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We focus on quality in everything we do. From pixel-perfect typography to zero-latency micro-interactions and bulletproof code.
            </p>
          </div>

          {/* Integrity */}
          <div className="p-7 rounded-2xl bg-[#090e1e]/80 border border-white/[0.08] hover:border-cyan-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Integrity</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We do what's right, always. Transparent roadmaps, realistic timelines, honest pricing, and complete dedication to your long-term success.
            </p>
          </div>
        </div>
      </section>

      {/* MEET OUR TEAM */}
      <section className="space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">
            THE MINDS BEHIND ZENTRA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Meet Our Team
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="group rounded-2xl bg-[#090e1e]/90 border border-white/8 hover:border-cyan-500/40 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/5] overflow-hidden bg-slate-900 relative">
                <img
                  src={getAssetUrl(member.avatar)}
                  alt={member.name}
                  onError={(e) => handleImageFallback(e, '/assets/team/sudeep-founder.jpg')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1e] via-transparent to-transparent opacity-90" />
                
                {/* Social links hover overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="p-2 rounded-full bg-black/60 hover:bg-cyan-500/30 text-white backdrop-blur-md transition-colors" aria-label="Twitter">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="p-2 rounded-full bg-black/60 hover:bg-cyan-500/30 text-white backdrop-blur-md transition-colors" aria-label="LinkedIn">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="p-2 rounded-full bg-black/60 hover:bg-cyan-500/30 text-white backdrop-blur-md transition-colors" aria-label="GitHub">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-cyan-400">
                  {member.role}
                </p>
                <p className="text-xs text-slate-400 pt-2 line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center py-12 rounded-3xl bg-gradient-to-b from-[#090e1f] to-transparent border border-white/[0.08] p-8 space-y-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Want to build the next big thing with us?
        </h3>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          We are always open to discuss ambitious projects, partnerships, or expanding our global remote engineering and design family.
        </p>
        <button
          onClick={onOpenProjectModal}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 inline-flex items-center gap-2"
        >
          <span>Start a Project</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
