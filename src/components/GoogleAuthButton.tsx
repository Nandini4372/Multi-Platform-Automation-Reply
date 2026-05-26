import React, { useState } from "react";
import { LogIn, LogOut, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { UserProfile } from "../types";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

interface GoogleAuthButtonProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export default function GoogleAuthButton({ profile, onUpdateProfile }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onUpdateProfile({
        name: user.displayName || "Google User",
        email: user.email || "",
        avatar: user.photoURL || "https://lh3.googleusercontent.com/a/default-user=s120-c",
        loggedIn: true,
      });
    } catch (err: any) {
      console.error("Firebase Google Auth error:", err);
      // Fallback or display friendly error message
      setError(err?.message || "Failed to authenticate. Open app in new tab if popups nested in folders get blocked.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      onUpdateProfile({
        name: "",
        email: "",
        avatar: "",
        loggedIn: false,
      });
    } catch (err: any) {
      console.error("Firebase SignOut error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (profile.loggedIn) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card-cream border border-neutral-charcoal text-neutral-charcoal rounded-sm text-xs md:text-sm shadow-sm font-body">
          <img
            src={profile.avatar || "https://lh3.googleusercontent.com/a/default-user=s120-c"}
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full border border-neutral-charcoal"
          />
          <span className="font-semibold text-neutral-charcoal hidden sm:inline">{profile.name}</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded-sm flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Signed In
          </span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={loading}
          id="btn-signout"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-tertiary-burgundy text-white hover:bg-red-950 transition-all font-mono text-xs border border-neutral-charcoal warm-shadow cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:scale-[0.98] disabled:opacity-50"
          title="Sign Out"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSignIn}
        disabled={loading}
        id="btn-signin"
        className="flex items-center gap-2 px-4 py-2 bg-primary-terracotta text-white font-mono text-xs md:text-sm font-bold uppercase tracking-wider border border-neutral-charcoal warm-shadow hover:translate-y-[-2px] hover:bg-amber-800 transition-all cursor-pointer active:translate-y-0 active:shadow-none disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
        Sign In with Google
      </button>
      {error && (
        <span className="text-[10px] text-red-700 font-mono flex items-center gap-0.5 max-w-[180px] break-words text-right">
          <AlertCircle className="w-3 h-3 text-red-700 shrink-0" />
          <span>{error.substring(0, 60)}...</span>
        </span>
      )}
    </div>
  );
}
