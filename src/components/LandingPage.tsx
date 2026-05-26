import React from "react";
import { 
  MessageSquare, 
  Layers, 
  Headphones, 
  TrendingUp, 
  Smartphone, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Database,
  Users,
  Star,
  BookOpen,
  ArrowUpRight
} from "lucide-react";
import { PageView } from "../types";

interface LandingPageProps {
  onNavigate: (view: PageView) => void;
  onLogInSimulation: () => void;
  isLoggedIn: boolean;
}

export default function LandingPage({ onNavigate, onLogInSimulation, isLoggedIn }: LandingPageProps) {
  return (
    <div id="landing-page" className="w-full relative sand-dot-grid py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto space-y-24">
      {/* Hero Section */}
      <section className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center pt-8">
        <div className="lg:col-span-7 space-y-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FAF2EA] bg-primary-terracotta px-3 py-1 border border-neutral-charcoal inline-block warm-shadow">
            The Conversational Brain // v2.4
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-black text-neutral-charcoal leading-[1.05] tracking-tight">
            Automate Every Customer <span className="italic text-primary-terracotta">Conversation</span>
          </h1>
          <p className="font-body text-base md:text-lg text-neutral-charcoal leading-relaxed max-w-2xl border-l-[3px] border-primary-terracotta pl-4">
            Unified Conversational Tracker. Automatically manage customer enquiries across WhatsApp, Instagram, Facebook, LinkedIn, and Voice agents in real time, with instant CRM status sync.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate("Inbox")}
              id="hero-get-started"
              className="px-6 py-3.5 bg-primary-terracotta text-white font-mono font-bold uppercase text-sm tracking-wider border border-neutral-charcoal warm-shadow hover:translate-y-[-2px] hover:bg-amber-800 transition-all cursor-pointer flex items-center gap-2"
            >
              Enter Unified Inbox <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("Guide")}
              id="hero-view-guide"
              className="px-6 py-3.5 bg-[#FAF2EA] text-neutral-charcoal font-mono font-bold uppercase text-sm tracking-widest border border-neutral-charcoal warm-shadow hover:translate-y-[-2px] hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-2"
            >
              Setup Guide <BookOpen className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF2EA] border border-neutral-charcoal warm-shadow">
              <span className="text-emerald-700 font-bold font-mono text-xs">● OFFICIAL PARTNER</span>
              <span className="text-xs font-bold text-neutral-charcoal font-body">Meta Business API Cloud Ready</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Card Mockup */}
        <div className="lg:col-span-5 relative mt-6 lg:mt-0">
          <div className="w-full bg-[#FAF2EA] border border-neutral-charcoal p-6 warm-shadow-lg space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-charcoal pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-terracotta animate-ping" />
                <span className="font-mono text-xs text-neutral-charcoal font-bold uppercase">Live Orchestrator Active</span>
              </div>
              <span className="font-mono text-[10px] bg-neutral-100 border border-neutral-charcoal px-2 py-0.5 text-neutral-charcoal">
                ID: CF-882P
              </span>
            </div>

            <div className="space-y-4">
              {/* Fake message bubble */}
              <div className="p-3.5 bg-white border border-neutral-charcoal">
                <p className="font-mono text-[10px] text-primary-terracotta uppercase font-bold mb-1">Customer via WhatsApp</p>
                <p className="font-body text-xs text-neutral-charcoal">
                  "Hi, I would like to book an appointment for tomorrow at 3:00 PM."
                </p>
              </div>

              {/* Bot response arrow */}
              <div className="flex justify-center my-1 text-primary-terracotta">
                <div className="h-6 w-0.5 bg-neutral-charcoal border-dashed border-l" />
              </div>

              {/* Automated Action */}
              <div className="p-3.5 bg-emerald-50 border border-neutral-charcoal">
                <p className="font-mono text-[10px] text-emerald-800 uppercase font-bold mb-1">AI Automated Response & Booking</p>
                <p className="font-body text-xs text-neutral-charcoal">
                  "Reserving Slot... Time: <strong className="text-emerald-800">3:00 PM</strong> | Client: <strong className="text-neutral-charcoal">Dr. Miller</strong>. Booking synced successfully! Status: <span className="bg-emerald-100 text-emerald-800 font-bold px-1 py-0.5 rounded text-[10px]">Scheduled</span>"
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => onNavigate("Inbox")}
                className="w-full py-2.5 bg-primary-terracotta text-white font-mono text-xs font-bold uppercase border border-neutral-charcoal warm-shadow hover:bg-neutral-charcoal active:translate-y-[2px]"
              >
                Launch Tracker Controls
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="space-y-10">
        <div className="text-center md:text-left space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-primary-terracotta font-bold">Comprehensive Multi-Channel Ecosystem</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-neutral-charcoal">
            The Multi-Platform Reply Solution
          </h2>
          <p className="font-body text-neutral-charcoal text-sm max-w-2xl">
            We automate conversational messaging. Your clients schedule bookings automatically, and you track statuses unified into a pristine sandbox dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#FAF2EA] border border-neutral-charcoal p-6 warm-shadow hover-raise space-y-4">
            <div className="w-10 h-10 bg-primary-terracotta/10 border border-primary-terracotta text-primary-terracotta flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-neutral-charcoal">1. WhatsApp API Sync</h3>
            <p className="font-body text-xs text-neutral-charcoal leading-relaxed">
              Connect to your customized live Supabase backends instantly. Read real-time names, phone numbers, appointment booking slots, and status values directly.
            </p>
          </div>

          <div className="bg-[#FAF2EA] border border-neutral-charcoal p-6 warm-shadow hover-raise space-y-4">
            <div className="w-10 h-10 bg-neutral-charcoal/10 border border-neutral-charcoal text-neutral-charcoal flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-neutral-charcoal">2. Social Media Feeds</h3>
            <p className="font-body text-xs text-neutral-charcoal leading-relaxed">
              Track mock responses and campaign leads structured across Instagram, LinkedIn, and Facebook. Perfect visual rhythm to manage multi-platform leads efficiently.
            </p>
          </div>

          <div className="bg-[#FAF2EA] border border-neutral-charcoal p-6 warm-shadow hover-raise space-y-4">
            <div className="w-10 h-10 bg-tertiary-burgundy/10 border border-tertiary-burgundy text-tertiary-burgundy flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-neutral-charcoal">3. Interactive IVR Caller</h3>
            <p className="font-body text-xs text-neutral-charcoal leading-relaxed">
              Experience the customized offline-first AI Voice automation module. Test direct IVR routing, key presses, voice menus, and transcript flows cleanly.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Workspace Integration flow diagram */}
      <section className="bg-neutral-charcoal border border-neutral-charcoal p-8 md:p-12 text-[#FAF2EA] warm-shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 font-display text-9xl font-black select-none pointer-events-none">
          BRAIN
        </div>

        <div className="max-w-3xl space-y-6">
          <span className="font-mono text-xs text-primary-terracotta bg-white px-2 py-0.5 font-bold uppercase">
            Data Pipelines
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-black leading-tight tracking-tight text-white">
            Infinite Automation Logic
          </h2>
          <p className="font-body text-sm text-neutral-300 leading-relaxed">
            When a customer sends a booking request, ChatFlux processes the message, extracts details, schedules the slot, saves the customer details in Supabase, and triggers alerts of the confirmed appointment.
          </p>

          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="border border-neutral-500 p-4 bg-neutral-800 text-center">
              <Smartphone className="w-5 h-5 mx-auto text-primary-terracotta mb-2" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider">1. Enquire</p>
              <p className="text-[10px] opacity-70">Client Sends Message</p>
            </div>
            <div className="border border-neutral-500 p-4 bg-neutral-800 text-center">
              <TrendingUp className="w-5 h-5 mx-auto text-yellow-300 mb-2" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider">2. Parse Model</p>
              <p className="text-[10px] opacity-70">AI Extracts Details</p>
            </div>
            <div className="border border-neutral-500 p-4 bg-neutral-800 text-center">
              <Database className="w-5 h-5 mx-auto text-emerald-400 mb-2" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider">3. Sync DB</p>
              <p className="text-[10px] opacity-70">Write to Supabase</p>
            </div>
            <div className="border border-neutral-500 p-4 bg-neutral-800 text-center">
              <CheckCircle className="w-5 h-5 mx-auto text-blue-400 mb-2" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider">4. Close</p>
              <p className="text-[10px] opacity-70">Visual confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Analytics Block */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6 flex flex-col justify-center">
          <h2 className="font-display text-3xl md:text-5xl font-black text-neutral-charcoal">
            Brutal Metrics Dashboard. <span className="underline decoration-primary-terracotta">Zero fluff</span>.
          </h2>
          <p className="font-body text-sm text-neutral-charcoal leading-relaxed">
            Get comprehensive, split-second analytical coverage directly. Keep up with high-scale enquiries without letting individual customer requests slip out of response windows.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-primary-terracotta" />
              <span className="font-mono text-xs font-bold text-neutral-charcoal uppercase">0.5s Average Voice AI Response latency</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-primary-terracotta" />
              <span className="font-mono text-xs font-bold text-neutral-charcoal uppercase">Direct Google login authorization</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-neutral-charcoal p-4 warm-shadow">
            <p className="font-mono text-[10px] text-neutral-charcoal opacity-60 uppercase font-bold">Average Auto Resolution</p>
            <p className="font-display text-4xl font-extrabold text-primary-terracotta pb-2">98.2%</p>
            <div className="w-full h-1 bg-neutral-200">
              <div className="w-[98.2%] h-full bg-primary-terracotta" />
            </div>
          </div>

          <div className="bg-white border border-neutral-charcoal p-4 warm-shadow">
            <p className="font-mono text-[10px] text-neutral-charcoal opacity-60 uppercase font-bold">Active Live Platforms</p>
            <p className="font-display text-4xl font-extrabold text-neutral-charcoal pb-2">5/5</p>
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="WhatsApp Live" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" title="Instagram Campaign Mode" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" title="LinkedIn Channel Buffer" />
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" title="Facebook Stream Tracker" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" title="AI Voice Engine Live" />
            </div>
          </div>

          <div className="bg-white border border-neutral-charcoal p-4 warm-shadow col-span-2">
            <p className="font-mono text-[10px] text-neutral-charcoal opacity-60 uppercase font-bold">Hourly Inflow Resolution Activity</p>
            <div className="h-16 flex items-end gap-1.5 pt-3">
              <div className="bg-primary-terracotta w-full h-[40%] rounded-sm" />
              <div className="bg-neutral-charcoal w-full h-[65%] rounded-sm" />
              <div className="bg-tertiary-burgundy/80 w-full h-[55%] rounded-sm" />
              <div className="bg-emerald-600 w-full h-[95%] rounded-sm" />
              <div className="bg-primary-terracotta w-full h-[85%] rounded-sm" />
              <div className="bg-neutral-charcoal w-full h-[70%] rounded-sm" />
              <div className="bg-tertiary-burgundy w-full h-[90%] rounded-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA section bottom */}
      <section className="text-center bg-[#FAF2EA] border-4 border-primary-terracotta p-8 md:p-12 warm-shadow-lg space-y-6">
        <h2 className="font-display text-4xl md:text-5xl font-black text-neutral-charcoal uppercase">
          Ready to scale your response time?
        </h2>
        <p className="font-body text-sm text-neutral-charcoal max-w-xl mx-auto">
          Start exploring our tracking systems today. Test simulated voice agents, review guide instructions, or load live Supabase datasets now.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onNavigate("Inbox")}
            className="px-8 py-4 bg-primary-terracotta hover:bg-neutral-charcoal text-white font-mono font-bold uppercase tracking-widest text-sm border border-neutral-charcoal warm-shadow-primary cursor-pointer active:translate-y-[2px]"
          >
            Launch Dashboards Free
          </button>
        </div>
      </section>
    </div>
  );
}
