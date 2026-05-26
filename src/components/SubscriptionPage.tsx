import React, { useState } from "react";
import { PageView } from "../types";
import { Check, Info, Sparkles, HelpCircle } from "lucide-react";

interface SubscriptionPageProps {
  onNavigate: (view: PageView) => void;
  userEmail?: string;
}

export default function SubscriptionPage({ onNavigate, userEmail }: SubscriptionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      id: "starter",
      name: "Standard Hub",
      price_monthly: 29,
      price_yearly: 24,
      limitPhrase: "Up to 500 automation triggers/mo",
      channels: ["WhatsApp Trackers", "Basic CRM Analytics"],
      unsupported: ["Instagram Feed", "LinkedIn Lead Tracking", "AI Voice Agent", "Sheet Live Export"],
      accent: false,
    },
    {
      id: "pro",
      name: "Orchestrator Pro",
      price_monthly: 79,
      price_yearly: 64,
      limitPhrase: "Unlimited conversational triggers",
      channels: ["WhatsApp Live Supabase Link", "Instagram Auto-reply logs", "LinkedIn & Facebook tracker Feed", "AI Voice Caller Simulations", "CSV Sheet Export API"],
      unsupported: [],
      accent: true,
    },
    {
      id: "enterprise",
      name: "Brutal Enterprise",
      price_monthly: 249,
      price_yearly: 199,
      limitPhrase: "Zero latency custom voice engines",
      channels: ["All Pro Channels", "Infinite Sub-accounts", "Bespoke IVR menu development", "Custom Supabase structure migrations", "Dedicated SLA support line"],
      unsupported: [],
      accent: false,
    },
  ];

  return (
    <div id="subscription-page" className="w-full relative sand-dot-grid py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto space-y-16">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary-terracotta bg-[#FAF2EA] border border-neutral-charcoal px-3 py-1">
          Flexible Pricing // Cancel Anytime
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-black text-neutral-charcoal">
          Plans Built For <span className="italic text-primary-terracotta">Growth</span>
        </h1>
        <p className="font-body text-sm text-neutral-charcoal leading-relaxed">
          Scale your custom customer message tracking systems effortlessly. Select your pricing node and activate elite automation.
        </p>

        {/* Billing Cycle Switcher */}
        <div className="pt-4 flex justify-center items-center gap-3">
          <span className={`text-xs font-bold font-mono ${billingCycle === "monthly" ? "text-primary-terracotta" : "text-neutral-charcoal"}`}>
            MONTHLY
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="w-12 h-6 bg-neutral-charcoal border border-neutral-charcoal rounded-full p-0.5 relative transition-all"
          >
            <div
              className={`w-4.5 h-4.5 bg-[#FAF2EA] rounded-full absolute top-[3.5px] transition-all ${
                billingCycle === "yearly" ? "left-6.5" : "left-1"
              }`}
            />
          </button>
          <span className={`text-xs font-bold font-mono ${billingCycle === "yearly" ? "text-primary-terracotta" : "text-[#78706A]"}`}>
            YEARLY <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 font-bold">SAVE 20%</span>
          </span>
        </div>
      </div>

      {/* Success Modal Notification if plan selected */}
      {selectedPlan && (
        <div className="p-4 bg-emerald-50 border border-emerald-500 text-emerald-950 font-body text-xs md:text-sm warm-shadow relative flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <p className="font-bold">Upgrade Requested for {plans.find((p) => p.id === selectedPlan)?.name}!</p>
              <p className="opacity-95 text-[11px]">
                Subscription update sent to <strong>{userEmail || "your email"}</strong>. You are currently running on our standard sandbox sandbox rate limits.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedPlan(null)}
            className="px-3 py-1 bg-[#FAF2EA] border border-neutral-charcoal hover:bg-neutral-100 text-neutral-charcoal font-mono text-[10px] font-bold uppercase"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Pricing Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {plans.map((p) => {
          const calculatedPrice = billingCycle === "monthly" ? p.price_monthly : p.price_yearly;
          return (
            <div
              key={p.id}
              className={`bg-white border rounded-sm p-6 flex flex-col justify-between warm-shadow ${
                p.accent ? "ring-2 ring-primary-terracotta border-primary-terracotta" : "border-neutral-charcoal"
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    {p.accent && (
                      <span className="text-[9px] font-mono font-bold bg-[#C2652A] text-white border border-neutral-charcoal px-1.5 py-0.5 uppercase tracking-wider block mb-1">
                        Most Popular
                      </span>
                    )}
                    <h3 className="font-display text-xl font-bold uppercase text-neutral-charcoal">{p.name}</h3>
                  </div>
                  <span className="font-mono text-xs font-extrabold uppercase text-neutral-charcoal opacity-60">
                    {billingCycle === "yearly" ? "Yearly rate" : "Monthly rate"}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl font-black text-neutral-charcoal">${calculatedPrice}</span>
                  <span className="font-mono text-xs text-neutral-charcoal opacity-70">/mo</span>
                </div>

                <p className="font-mono text-[11px] text-[#78706A] font-bold border-b border-dashed border-neutral-200 pb-3">
                  {p.limitPhrase}
                </p>

                {/* Features included */}
                <div className="space-y-2.5 pt-2">
                  <p className="font-mono text-[10px] uppercase font-bold text-neutral-charcoal tracking-wide">Included Channels:</p>
                  <ul className="space-y-2 text-xs text-neutral-charcoal">
                    {p.channels.map((ch, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{ch}</span>
                      </li>
                    ))}
                    {p.unsupported.map((ch, idx) => (
                      <li key={idx} className="flex items-center gap-2 opacity-40">
                        <span className="text-neutral-400 shrink-0 font-bold">✕</span>
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setSelectedPlan(p.id)}
                  className={`w-full py-3 font-mono text-xs font-bold uppercase border border-neutral-charcoal warm-shadow hover:translate-y-[-2px] tracking-widest transition-all cursor-pointer ${
                    p.accent
                      ? "bg-primary-terracotta text-white hover:bg-[#8C3C3C]"
                      : "bg-[#FAF2EA] text-neutral-charcoal hover:bg-neutral-100"
                  }`}
                >
                  Activate {p.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequently Asked Questions */}
      <section className="bg-[#FAF2EA] border border-neutral-charcoal p-8 warm-shadow">
        <h3 className="font-display text-2xl font-bold text-neutral-charcoal uppercase border-b border-neutral-charcoal pb-3 mb-6">
          Frequently Answered Inquiries
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-display text-base font-bold text-neutral-charcoal flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-terracotta" /> Core Sync Terms?
            </h4>
            <p className="font-body text-xs text-neutral-charcoal opacity-90 leading-relaxed">
              Our Pro tier lets you query your own Supabase live tables seamlessly with standard HTTP fetch clients on the WhatsApp page, completely bypassing cloud sync limits.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-display text-base font-bold text-neutral-charcoal flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-terracotta" /> Voice Synthesizers?
            </h4>
            <p className="font-body text-xs text-neutral-charcoal opacity-90 leading-relaxed">
              We leverage built-in system audio engines to simulate premium voice. Since all computation executes locally, Standard and Pro plans incur zero latency bills.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
