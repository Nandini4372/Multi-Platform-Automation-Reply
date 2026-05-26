import React, { useState, useEffect } from "react";
import { 
  Home, 
  BookOpen, 
  CreditCard, 
  Inbox, 
  User, 
  LogOut, 
  ShieldAlert, 
  CheckCircle,
  Hash,
  Sparkles,
  Database,
  ArrowRight
} from "lucide-react";
import { PageView, UserProfile } from "./types";
import LandingPage from "./components/LandingPage";
import GuidePage from "./components/GuidePage";
import SubscriptionPage from "./components/SubscriptionPage";
import UnifiedInbox from "./components/UnifiedInbox";
import GoogleAuthButton from "./components/GoogleAuthButton";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export default function App() {
  const [currentView, setCurrentView] = useState<PageView | "Profile">(() => {
    const saved = localStorage.getItem("chatflux_current_view");
    return (saved as PageView | "Profile") || "Landing";
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("chatflux_user_profile");
    if (saved) return JSON.parse(saved);
    // Initial guest state
    return {
      name: "",
      email: "",
      avatar: "",
      loggedIn: false,
    };
  });

  // Listen to verified firebase authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setProfile({
          name: user.displayName || "Google User",
          email: user.email || "",
          avatar: user.photoURL || "https://lh3.googleusercontent.com/a/default-user=s120-c",
          loggedIn: true,
        });
      } else {
        setProfile({
          name: "",
          email: "",
          avatar: "",
          loggedIn: false,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Local Storage persistence
  useEffect(() => {
    localStorage.setItem("chatflux_current_view", currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem("chatflux_user_profile", JSON.stringify(profile));
  }, [profile]);

  // Navigate utility
  const handleNavigate = (view: PageView | "Profile") => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Google sign in trigger mapping via real popup
  const handleLogInSimulation = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setCurrentView("Inbox");
    } catch (err) {
      console.error("Real Google login trigger failed:", err);
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      setProfile({
        name: "",
        email: "",
        avatar: "",
        loggedIn: false,
      });
      setCurrentView("Landing");
    } catch (err) {
      console.error("Real Google logout trigger failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-sand font-body text-neutral-charcoal relative transition-colors duration-300">
      
      {/* Decorative Warm Top Boundary Rail */}
      <div className="h-2 bg-primary-terracotta w-full" />

      {/* Primary Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FAF2EA] border-b border-neutral-charcoal px-4 md:px-8 py-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Custom Logo Brand */}
        <div 
          onClick={() => handleNavigate("Landing")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 border border-neutral-charcoal bg-[#C2652A] text-white flex items-center justify-center font-bold text-xl warm-shadow hover:rotate-2 transition-transform">
            CF
          </div>
          <div>
            <span className="font-display text-2xl font-black text-neutral-charcoal tracking-tighter uppercase group-hover:text-primary-terracotta transition-colors">
              ChatFlux
            </span>
            <span className="font-mono text-[9px] block text-neutral-charcoal/60 uppercase font-black leading-none">
              Automation Reply Matrix
            </span>
          </div>
        </div>

        {/* Dynamic Route Controls */}
        <nav className="flex flex-wrap items-center gap-4 md:gap-8 font-mono text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => handleNavigate("Landing")}
            className={`cursor-pointer hover:text-primary-terracotta transition-all ${
              currentView === "Landing" ? "text-primary-terracotta underline decoration-2 underline-offset-4" : "text-neutral-charcoal"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate("Guide")}
            className={`cursor-pointer hover:text-primary-terracotta transition-all ${
              currentView === "Guide" ? "text-primary-terracotta underline decoration-2 underline-offset-4" : "text-neutral-charcoal"
            }`}
          >
            Guide
          </button>
          <button
            onClick={() => handleNavigate("Subscription")}
            className={`cursor-pointer hover:text-primary-terracotta transition-all ${
              currentView === "Subscription" ? "text-primary-terracotta underline decoration-2 underline-offset-4" : "text-neutral-charcoal"
            }`}
          >
            Subscription
          </button>
          <button
            onClick={() => handleNavigate("Inbox")}
            className={`cursor-pointer hover:text-primary-terracotta transition-all flex items-center gap-1.5 ${
              currentView === "Inbox" ? "text-primary-terracotta underline decoration-2 underline-offset-4" : "text-neutral-charcoal"
            }`}
          >
            <Inbox className="w-4 h-4 text-primary-terracotta" />
            Unified Inbox
          </button>

          {profile.loggedIn && (
            <button
              onClick={() => handleNavigate("Profile")}
              className={`cursor-pointer hover:text-primary-terracotta transition-all flex items-center gap-1 ${
                currentView === "Profile" ? "text-primary-terracotta underline decoration-2 underline-offset-4" : "text-neutral-charcoal"
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
          )}
        </nav>

        {/* Google Authentication Section */}
        <div className="flex items-center gap-3">
          <GoogleAuthButton profile={profile} onUpdateProfile={setProfile} />
        </div>
      </header>

      {/* Main Content Node Router */}
      <main className="flex-1 pb-20">
        {currentView === "Landing" && (
          <LandingPage 
            onNavigate={handleNavigate} 
            onLogInSimulation={handleLogInSimulation} 
            isLoggedIn={profile.loggedIn} 
          />
        )}

        {currentView === "Guide" && (
          <GuidePage onNavigate={handleNavigate} />
        )}

        {currentView === "Subscription" && (
          <SubscriptionPage onNavigate={handleNavigate} userEmail={profile.email} />
        )}

        {currentView === "Inbox" && (
          <UnifiedInbox 
            profile={profile} 
            onUpdateProfile={setProfile} 
            onNavigate={handleNavigate} 
            onSignIn={handleLogInSimulation}
          />
        )}

        {currentView === "Profile" && profile.loggedIn && (
          /* Dedicated Profile Page view as specified in prompt */
          <div id="profile-page" className="w-full relative sand-dot-grid py-12 md:py-20 px-4 md:px-12 max-w-2xl mx-auto space-y-8 font-body">
            
            <div className="text-center space-y-3">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#FAF2EA] bg-neutral-charcoal border border-neutral-charcoal px-2.5 py-1">
                Account Credentials // ID Node
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-black text-neutral-charcoal">
                Your Profile
              </h1>
              <p className="font-body text-xs text-neutral-charcoal opacity-80">
                Manage your live database status credentials and authentication scopes cleanly.
              </p>
            </div>

            {/* Profile Detail Card */}
            <div className="bg-white border rounded-sm border-neutral-charcoal p-8 warm-shadow space-y-6">
              <div className="flex items-center gap-4 border-b border-neutral-200 pb-5">
                <img
                  src={profile.avatar || "https://lh3.googleusercontent.com/a/default-user=s120-c"}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full border-2 border-primary-terracotta warm-shadow"
                />
                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-neutral-charcoal">{profile.name}</h3>
                  <p className="font-mono text-xs text-neutral-charcoal opacity-70">{profile.email}</p>
                  <p className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 font-bold uppercase mt-1 inline-block">
                    ● Authenticated via Google
                  </p>
                </div>
              </div>

              {/* CRM subscription status overview */}
              <div className="space-y-3 font-body text-xs text-neutral-charcoal">
                <h4 className="font-mono text-[10px] uppercase font-bold text-neutral-charcoal opacity-60">System Attributes</h4>
                
                <div className="grid grid-cols-2 gap-3 bg-card-cream border border-neutral-200 p-4">
                  <div>
                    <span className="opacity-60 block text-[10px] uppercase">Plan Tier:</span>
                    <strong className="text-sm text-primary-terracotta">Orchestrator Pro</strong>
                  </div>
                  <div>
                    <span className="opacity-60 block text-[10px] uppercase">Account Status:</span>
                    <strong className="text-sm text-emerald-700">Sandbox Unrestricted</strong>
                  </div>
                  <div className="pt-2 border-t border-dashed border-neutral-300 col-span-2">
                    <span className="opacity-60 block text-[10px] uppercase">Active Channels Tracked:</span>
                    <span className="font-semibold block pt-0.5">5/5 Channels Functional</span>
                  </div>
                </div>
              </div>

              {/* Database Status Info */}
              <div className="space-y-2 text-xs">
                <h4 className="font-mono text-[10px] uppercase font-bold text-neutral-charcoal opacity-60">Database Integrity Parameters</h4>
                <div className="flex items-center gap-2 text-[#78706A]">
                  <Database className="w-4 h-4 text-primary-terracotta shrink-0" />
                  <span>WhatsApp integration queries standard client-side storage keys securely.</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex gap-3 border-t border-neutral-200">
                <button
                  onClick={() => handleNavigate("Inbox")}
                  className="w-full py-2.5 bg-[#FAF2EA] hover:bg-neutral-100 text-neutral-charcoal font-mono text-xs font-bold uppercase text-center border border-neutral-charcoal rounded-sm cursor-pointer warm-shadow"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={handleLogOut}
                  className="w-full py-2.5 bg-tertiary-burgundy hover:bg-red-950 text-white font-mono text-xs font-bold uppercase text-center border border-neutral-charcoal rounded-sm cursor-pointer warm-shadow"
                >
                  Logout Core Session
                </button>
              </div>
            </div>

            {/* Simulated Workspace Information */}
            <div className="p-4 bg-orange-50 border border-neutral-300 text-[11px] leading-relaxed text-neutral-charcoal text-center">
              📌 To edit your custom database parameters, visit the <strong>WhatsApp Configuration</strong> directly under the Unified Inbox.
            </div>

          </div>
        )}
      </main>

      {/* Fixed Sticky Brutalist Bottom Footer */}
      <footer className="bg-neutral-charcoal border-t-2 border-neutral-charcoal text-[#FAF2EA] py-8 px-4 md:px-8 font-body">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-white text-neutral-charcoal font-black flex items-center justify-center text-[10px]">
              C
            </span>
            <span className="font-display font-medium text-sm tracking-wide text-white uppercase">
              ChatFlux AI © 2026
            </span>
          </div>
          <p className="font-mono text-[10px] text-neutral-300 uppercase font-semibold">
            Automating customer replies across boundaries with pristine efficiency.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => handleNavigate("Guide")}
              className="hover:underline font-mono text-[10px] uppercase font-bold text-primary-terracotta"
            >
              System API Guides
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
