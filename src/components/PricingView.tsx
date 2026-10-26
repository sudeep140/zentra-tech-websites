import React, { useState } from 'react';
import { Check, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '../data/mockData.js';
import { calculateTierPrice } from '../utils/pricing.js';

interface PricingViewProps {
  onSelectPlan: (planName: string, tierBudget: string) => void;
  onNavigateToContact: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  onSelectPlan,
  onNavigateToContact,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="space-y-16 sm:space-y-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          OUR PLANS
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Pricing
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Transparent pricing. Flexible plans. Choose the package that fits your goals or get a custom quote.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="pt-4 flex items-center justify-center">
          <div className="inline-flex items-center p-1.5 rounded-full bg-[#0a0f22] border border-white/[0.08]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yearly</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pricing Cards matching reference screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const calc = calculateTierPrice(plan.monthlyPrice, billingCycle, 20);
          const isPro = plan.isPopular;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 ${
                isPro
                  ? 'bg-gradient-to-b from-[#0e1938] to-[#091024] border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20 lg:-translate-y-2'
                  : 'bg-[#080d1c]/80 border border-white/[0.08] hover:border-white/20'
              }`}
            >
              {/* Popular Ribbon */}
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/30">
                  Most popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 min-h-[36px]">{plan.description}</p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 border-b border-white/[0.08] pb-6">
                  <span className="text-4xl sm:text-5xl font-extrabold font-display text-white">
                    {calc.formattedPrice}
                    {plan.id === 'enterprise' ? '+' : ''}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 font-medium">
                    {plan.period}
                  </span>
                  {billingCycle === 'yearly' && (
                    <span className="text-xs text-emerald-400 font-semibold ml-2">
                      (Billed annually)
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Features Included:
                  </span>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isPro ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/10 text-slate-300'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-6">
                <button
                  onClick={() => onSelectPlan(plan.name, calc.formattedPrice)}
                  className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                    isPro
                      ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.01]'
                      : 'bg-white/[0.05] hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Need a custom solution? callout matching reference */}
      <div className="relative rounded-3xl p-8 sm:p-10 border border-white/[0.08] bg-gradient-to-r from-[#090f23] to-[#070b18] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2 text-center md:text-left z-10">
          <h3 className="text-2xl font-bold text-white">Need a custom solution?</h3>
          <p className="text-sm text-slate-400 max-w-xl">
            Let's discuss your project and create a custom plan that fits your exact budget, milestones, and technical requirements.
          </p>
        </div>

        <button
          onClick={onNavigateToContact}
          className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 whitespace-nowrap transition-all z-10"
        >
          Contact Us
        </button>

        {/* Ambient glowing circle */}
        <div className="absolute right-0 top-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
};
