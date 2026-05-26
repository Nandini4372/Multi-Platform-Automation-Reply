import React from "react";
import { PageView } from "../types";
import { BookOpen, Database, MessageSquare, PhoneCall, Code, CheckCircle, ArrowRight } from "lucide-react";

interface GuidePageProps {
  onNavigate: (view: PageView) => void;
}

export default function GuidePage({ onNavigate }: GuidePageProps) {
  return (
    <div id="guide-page" className="w-full relative sand-dot-grid py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto space-y-16">
      
      {/* Editorial Header */}
      <div className="space-y-4 text-center md:text-left">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary-terracotta bg-[#FAF2EA] border border-neutral-charcoal px-3 py-1">
          Technical Handbook // System Configuration
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-black text-neutral-charcoal">
          How ChatFlux Works
        </h1>
        <p className="font-body text-base text-neutral-charcoal max-w-2xl">
          Deploy automated, multi-platform reply workflows, monitor real-time appointments, and orchestrate client data pipelines in under ten minutes.
        </p>
      </div>

      {/* Guide Columns */}
      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Core Instructions */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Section 1: Supabase Setup */}
          <div className="bg-white border border-neutral-charcoal p-6 md:p-8 warm-shadow space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-charcoal pb-4">
              <Database className="w-6 h-6 text-primary-terracotta" />
              <h2 className="font-display text-2xl font-bold uppercase text-neutral-charcoal">
                1. Supabase & WhatsApp Integration
              </h2>
            </div>
            
            <p className="font-body text-xs md:text-sm text-neutral-charcoal leading-relaxed">
              ChatFlux features a direct database integration for WhatsApp appointments. In the Unified Inbox, choose the <strong>WhatsApp channel</strong> and enter your persistent Supabase credentials into the config panel to view real live customer bookings dynamically.
            </p>

            <div className="bg-card-cream border border-neutral-charcoal p-4 space-y-3">
              <p className="font-mono text-xs font-bold text-neutral-charcoal">Recommended PostgreSQL Schema Query:</p>
              <pre className="text-[11px] bg-neutral-900 text-amber-100 p-3 overflow-x-auto rounded-sm font-mono leading-relaxed">
{`CREATE TABLE bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  time text NOT NULL,
  status text DEFAULT 'Scheduled' NOT NULL,
  platform text DEFAULT 'whatsapp' NOT NULL,
  notes text,
  created_at timestamp WITH time zone DEFAULT now()
);`}
              </pre>
            </div>

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-neutral-charcoal">Instructions to Connect:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-charcoal">
                <li>Create the <code>bookings</code> table in your Supabase project with columns matching the SQL schema above.</li>
                <li>Ensure Row-Level Security (RLS) is configured to permit anonymous read access or supply an anonymous key with selective privileges.</li>
                <li>Go to the WhatsApp page, click <strong>"Configure Supabase"</strong>, paste your <strong>Supabase API URL</strong> and <strong>Anon Public Key</strong>, and ChatFlux immediately queries live data.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: AI Voice Automation Call Module */}
          <div className="bg-white border border-neutral-charcoal p-6 md:p-8 warm-shadow space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-charcoal pb-4">
              <PhoneCall className="w-6 h-6 text-primary-terracotta" />
              <h2 className="font-display text-2xl font-bold uppercase text-neutral-charcoal">
                2. AI Voice & IVR Call Agent Configuration
              </h2>
            </div>

            <p className="font-body text-xs md:text-sm text-neutral-charcoal leading-relaxed">
              The AI Voice Agent lets your clients dial in directly to enquire about service scheduling. We've built an interactive, offline-first <strong>IVR voice generator console</strong> that simulates incoming voice streams. You can edit prompt parameters, and test menu inputs.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-neutral-200 p-4 bg-emerald-50 text-neutral-charcoal space-y-2">
                <span className="font-mono text-[10px] bg-emerald-100 px-2 py-0.5 font-bold uppercase text-emerald-800">No-Code Dial Menu Router</span>
                <p className="font-display text-base font-bold">Interactive Keypad Rules</p>
                <p className="text-[11px] leading-relaxed">
                  Map keys (e.g., Press 1 to schedule bookings, Pres 2 for cancellation inquiries) into customizable automated greeting playbooks.
                </p>
              </div>

              <div className="border border-neutral-200 p-4 bg-orange-50 text-neutral-charcoal space-y-2">
                <span className="font-mono text-[10px] bg-orange-100 px-2 py-0.5 font-bold uppercase text-[#C2652A]">Low-latency Synthesizer</span>
                <p className="font-display text-base font-bold">Speech-to-Text Loop</p>
                <p className="text-[11px] leading-relaxed">
                  Utilizes browsers' native high-fidelity vocal synthesis nodes so that you can hear active agent prompts speaking directly with no setup required.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: CRM Sheet Export & Tracking Core */}
          <div className="bg-white border border-neutral-charcoal p-6 md:p-8 warm-shadow space-y-4">
            <div className="flex items-center gap-3 border-b border-neutral-charcoal pb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <h2 className="font-display text-2xl font-bold uppercase text-neutral-charcoal">
                3. Tracking & CSV Sheet Export
              </h2>
            </div>
            <p className="font-body text-xs md:text-sm text-neutral-charcoal leading-relaxed">
              Inside each of the platform tabs (WhatsApp, Instagram, Facebook, LinkedIn, Voice agent), bookings are properly classified. To ensure complete records ownership:
            </p>
            <ul className="list-disc pl-5 text-xs text-neutral-charcoal space-y-1.5 leading-relaxed">
              <li>Use the <strong>"Export CRM Data"</strong> button in the live view to instantaneously extract all current client datasets.</li>
              <li>Saves locally to standard CSV spreadsheets for instant import into Google Sheets, Airtable, or your favorite CRM.</li>
              <li>Allows team members to query client columns, track booking status updates, and confirm scheduled calls.</li>
            </ul>
          </div>

        </div>

        {/* Quick Start Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF2EA] border border-neutral-charcoal p-6 warm-shadow space-y-6">
            <h3 className="font-display text-lg font-bold uppercase text-neutral-charcoal">Quick Actions</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => onNavigate("Inbox")}
                className="w-full py-3 bg-primary-terracotta text-white font-mono text-xs font-bold uppercase text-center border border-neutral-charcoal warm-shadow hover:bg-neutral-charcoal transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Go to Inbox Dashboard <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onNavigate("Subscription")}
                className="w-full py-3 bg-white text-neutral-charcoal font-mono text-xs font-bold uppercase text-center border border-neutral-charcoal warm-shadow hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Pricing & Subscription
              </button>
            </div>

            <div className="border-t border-neutral-charcoal pt-4 space-y-2">
              <p className="font-mono text-[10px] text-neutral-charcoal uppercase font-bold">System Status Overview</p>
              <div className="flex items-center gap-2 text-xs text-neutral-charcoal">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>WhatsApp Module Ready</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-charcoal">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>AI Voice Synthesis Native API Active</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-charcoal">
                <span className="w-2 h-2 rounded-full bg-[#C2652A]" />
                <span>Google Auth API Ready</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-charcoal p-6 warm-shadow-lg text-neutral-charcoal space-y-4 text-center">
            <span className="text-[28px]">💡</span>
            <p className="font-display text-base font-bold uppercase">Protip</p>
            <p className="font-body text-xs leading-relaxed">
              Keep the ChatFlux browser window open or export client records to Google Sheets at the end of each shift to coordinate client callback workflows seamlessly!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
