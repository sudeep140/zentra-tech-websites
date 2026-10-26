import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, Twitter, Linkedin, Github } from 'lucide-react';
import confetti from 'canvas-confetti';
import { validateLeadSubmission } from '../utils/leads.js';
import { submitLeadApi } from '../utils/api.js';
import { LeadItem } from '../types/index.js';

interface ContactViewProps {
  onAddLead: (newLead: LeadItem) => void;
  preselectedService?: string;
}

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const ContactView: React.FC<ContactViewProps> = ({ onAddLead, preselectedService = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: preselectedService || 'Web Design & Development',
    message: '',
    budget: '$5,000 - $10,000',
  });

  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateLeadSubmission(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await submitLeadApi({
        name: formData.name.trim(),
        email: formData.email.trim(),
        service: formData.service,
        message: formData.message.trim(),
        budget: formData.budget,
        honeypot,
      });

      onAddLead(response.lead);
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
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
                Thank you for reaching out, <span className="text-cyan-300 font-semibold">{formData.name}</span>. Our engineering team has received your enquiry and will respond within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', service: 'Web Design & Development', message: '', budget: '$5,000 - $10,000' });
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {submitError}
                </div>
              )}

              {/* Invisible honeypot field for bot spam trap */}
              <input
                type="text"
                name="_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
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

              {/* Service & Budget Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Estimated Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f20] border border-white/10 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                  >
                    <option value="<$1,700">&lt; $1,700 (Starter)</option>
                    <option value="$1,700 - $3,500">$1,700 - $3,500</option>
                    <option value="$5,000 - $10,000">$3,500 - $5,000 (Popular)</option>
                    <option value="$5,000 - $7,500">$5,000 - $7,500</option>
                    <option value="$7,500+">$12,000+ (Enterprise)</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Project Details *
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your brand goals, target timeline, or features you want to build..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm resize-none"
                />
                {errors.message && <p className="text-xs text-rose-400 mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Dispatching Enquiry...' : 'Send Message'}</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          )}
        </div>

        {/* Right: Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-8 bg-[#090e1f]/90 border border-white/[0.08] shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white">Contact Information</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We operate globally with a remote-first engineering presence and dedicated studio partners in San Francisco, London, and Kathmandu.
            </p>

            <div className="space-y-5 pt-2">
              <div className="flex items-start gap-4">
                <a
                  href="mailto:zentratech11@gmail.com?subject=Project%20Enquiry"
                  className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all"
                  aria-label="Send Project Enquiry Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Us</div>
                  <a
                    href="mailto:zentratech11@gmail.com?subject=Project%20Enquiry"
                    className="text-sm font-medium text-white hover:text-cyan-300 transition-colors"
                  >
                    zentratech11@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Number</div>
                  <a
                    href="https://wa.me/9779745512242"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-white hover:text-emerald-400 transition-colors font-mono"
                  >
                    +977 9745512242
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Studio Headquarters</div>
                  <div className="text-sm font-medium text-white">
                    Kapan,Kathmandu & Global Digital Studio
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.08]">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Social Channels
              </div>
              <div className="flex items-center gap-3">
                {[
                  { icon: Twitter, href: 'https://twitter.com' },
                  { icon: Linkedin, href: 'https://linkedin.com' },
                  { icon: Github, href: 'https://github.com' },
                ].map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
