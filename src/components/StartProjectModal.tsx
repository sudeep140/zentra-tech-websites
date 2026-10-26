import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { estimateProjectBudget } from '../utils/pricing.js';
import { submitLeadApi } from '../utils/api.js';
import { LeadItem } from '../types/index.js';

interface StartProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: LeadItem) => void;
  initialService?: string;
}

export const StartProjectModal: React.FC<StartProjectModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
  initialService = 'Web Design & Development',
}) => {
  const [tier, setTier] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    initialService || 'Web Design & Development',
  ]);
  const [urgentDelivery, setUrgentDelivery] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const servicesList = [
    'Web Design & Development',
    '3D Websites & Experiences',
    'AI Agents & Automation',
    'Brand Identity & Visuals',
    'Custom Web Applications',
  ];

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const estimatedBudget = estimateProjectBudget(selectedServices, tier, urgentDelivery);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) {
      setErrorMsg('Please enter your name and email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const response = await submitLeadApi({
        name: clientName.trim(),
        email: clientEmail.trim(),
        service: selectedServices.join(', '),
        message: `${tier.toUpperCase()} Tier inquiry: ${projectBrief || 'Requested project proposal & estimate.'}`,
        budget: `$${estimatedBudget.toLocaleString()}`,
        timeline: urgentDelivery ? 'Rush 2-week turnaround' : 'Standard 4-6 weeks',
        honeypot,
      });

      onAddLead(response.lead);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#3b82f6', '#f97316'],
        });
      } catch {
        // Ignored
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="max-w-2xl w-full rounded-3xl bg-[#080d1d] border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Start a Project</h2>
              <p className="text-xs text-slate-400">Configure your scope & get an instant project estimate</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-cyan-400 mx-auto" />
            <h3 className="text-2xl font-bold text-white">Proposal Received!</h3>
            <p className="text-sm text-slate-300">
              Thank you, <strong className="text-white">{clientName}</strong>. Your project estimate of{' '}
              <strong className="text-cyan-400 font-bold">${estimatedBudget.toLocaleString()}</strong> has been submitted. Our creative team will reach out with an initial scope outline within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-full bg-cyan-500 text-black font-semibold text-xs transition-transform hover:scale-105"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Invisible honeypot */}
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

            {/* Step 1: Select Tier */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Tier Scope
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'starter', label: 'Starter', desc: 'From $999' },
                  { id: 'pro', label: 'Pro', desc: 'From $2,499 (Popular)' },
                  { id: 'enterprise', label: 'Enterprise', desc: 'From $4,999' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTier(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      tier === item.id
                        ? 'bg-blue-600/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="text-[11px] text-cyan-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Services */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                2. Required Deliverables
              </label>
              <div className="flex flex-wrap gap-2">
                {servicesList.map((srv) => {
                  const isSelected = selectedServices.includes(srv);
                  return (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => toggleService(srv)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                          : 'bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {srv}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Turnaround toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white">Priority Rush Delivery</div>
                  <div className="text-[11px] text-slate-400">Guaranteed 2-week sprint turnaround (+25%)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={urgentDelivery}
                onChange={(e) => setUrgentDelivery(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
              />
            </div>

            {/* Estimated Budget Display */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Calculated Initial Estimate</span>
                <span className="text-2xl font-black font-display text-cyan-300">
                  ${estimatedBudget.toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-slate-400 text-right">
                Includes deliverables & QA
              </span>
            </div>

            {/* Contact Inputs */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Optional notes or reference website links..."
                value={projectBrief}
                onChange={(e) => setProjectBrief(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Proposal...</span>
                </>
              ) : (
                <>
                  <span>Submit Project Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
