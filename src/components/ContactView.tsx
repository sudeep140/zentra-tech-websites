import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, Twitter, Linkedin, Instagram, Dribbble } from 'lucide-react';
import confetti from 'canvas-confetti';
import { validateLeadSubmission } from '../utils/leads.js';
import { LeadItem } from '../types/index.js';

interface ContactViewProps {
  onAddLead: (newLead: LeadItem) => void;
  preselectedService?: string;
}

export const ContactView: React.FC<ContactViewProps> = ({ onAddLead, preselectedService = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: preselectedService || 'Web Design & Development',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeadSubmission(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      service: formData.service,
      message: formData.message.trim(),
      status: 'New',
      date: new Date().toISOString().split('T')[0],
      budget: 'Standard',
    };

    onAddLead(newLead);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#3b82f6', '#f97316'],
      });
    } catch {
      // Ignored if confetti unavailable
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          OUR CONTACT
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Get In Touch
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Have a project in mind? Let's talk! We’d love to hear about your ideas and help you bring them to life.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 rounded-3xl p-8 sm:p-10 bg-[#090e1f]/90 border border-white/[0.08] shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Dispatched!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Thank you for reaching out, <span className="text-cyan-300 font-semibold">{formData.name}</span>. Our team will review your project requirements and respond within 24 hours. Your lead is now logged in the Admin Portal.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', service: 'Web Design & Development', message: '' });
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                />
                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                />
                {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
              </div>

              {/* Service */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Service *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0f20] border border-white/10 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                >
                  <option value="Web Design & Development">Web Design & Development</option>
                  <option value="3D Websites & Experiences">3D Websites & Experiences</option>
                  <option value="AI Agents & Automation">AI Agents & Automation</option>
                  <option value="Brand Identity & Visuals">Brand Identity & Visuals</option>
                  <option value="Custom Web Applications">Custom Web Applications</option>
                </select>
                {errors.service && <p className="text-xs text-rose-400 mt-1">{errors.service}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project, goals, and timeline..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm resize-none"
                />
                {errors.message && <p className="text-xs text-rose-400 mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Right: Contact Information matching screenshot */}
        <div className="lg:col-span-5 rounded-3xl p-8 sm:p-10 bg-[#080d1c]/90 border border-white/[0.08] shadow-xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Reach out to us directly or stop by for coffee at our studio.
            </p>
          </div>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Email</span>
                <a href="mailto:hello@zentra.tech" className="text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition-colors">
                  hello@zentra.tech
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Phone</span>
                <a href="tel:+9779812345678" className="text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition-colors">
                  +977 9812345678
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Location</span>
                <p className="text-sm sm:text-base font-semibold text-white">
                  Kathmandu, Nepal
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Available for Worldwide Remote Work</p>
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div className="pt-6 border-t border-white/[0.08] space-y-3">
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
              Follow Us
            </span>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all" aria-label="Dribbble">
                <Dribbble className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
