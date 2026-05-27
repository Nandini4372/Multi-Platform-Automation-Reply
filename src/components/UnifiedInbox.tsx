import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Instagram, 
  Linkedin, 
  Facebook, 
  PhoneCall, 
  Search, 
  FileSpreadsheet, 
  Settings, 
  User, 
  Calendar, 
  Phone, 
  CheckCircle,
  Database,
  Volume2,
  ChevronRight,
  RefreshCw,
  Clock,
  Mic,
  Smile,
  LogOut,
  Sparkles,
  Check,
  AlertCircle,
  ShieldAlert,
  LogIn
} from "lucide-react";
import { Booking, BookingStatus, PlatformId, SupabaseConfig, UserProfile, N8NBrainConfig } from "../types";
import { createClient } from "@supabase/supabase-js";

interface UnifiedInboxProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigate: (view: any) => void;
  onSignIn?: () => Promise<void> | void;
}

// Initial default fake bookings for classification when not connected to Supabase
const DEFAULT_BOOKINGS: Booking[] = [
  // WhatsApp
  {
    id: "wa-1",
    name: "Sarah Chen",
    phone: "+39 333 456 7891",
    time: "2026-05-27 10:00 AM",
    status: "Scheduled",
    platform: "whatsapp",
    notes: "Requires Italian translator onboarding reference documents.",
    customer_name: "Sarah Chen",
    customer_phone: "+39 333 456 7891",
    booking_date: "2026-05-27",
    booking_time: "10:00 AM",
    booking_status: "Scheduled"
  },
  {
    id: "wa-2",
    name: "Alexander Vance",
    phone: "+1 650 555 1234",
    time: "2026-05-27 02:30 PM",
    status: "Pending",
    platform: "whatsapp",
    notes: "Meta API integration prospect interested in standard flow structures.",
    customer_name: "Alexander Vance",
    customer_phone: "+1 650 555 1234",
    booking_date: "2026-05-27",
    booking_time: "02:30 PM",
    booking_status: "Pending"
  },
  // Instagram
  {
    id: "ig-1",
    name: "Yuki Tanaka",
    phone: "+81 90 1234 5678",
    time: "2026-05-28 11:30 AM",
    status: "Scheduled",
    platform: "instagram",
    notes: "Discovered via spring collection carousel and automated direct message reply.",
    customer_name: "Yuki Tanaka",
    customer_phone: "+81 90 1234 5678",
    booking_date: "2026-05-28",
    booking_time: "11:30 AM",
    booking_status: "Scheduled"
  },
  {
    id: "ig-2",
    name: "Chloe Dubois",
    phone: "+33 6 1234 5678",
    time: "2026-05-28 04:00 PM",
    status: "Completed",
    platform: "instagram",
    notes: "Lead captured via summer discount coupon automation code lookup.",
    customer_name: "Chloe Dubois",
    customer_phone: "+33 6 1234 5678",
    booking_date: "2026-05-28",
    booking_time: "04:00 PM",
    booking_status: "Completed"
  },
  // LinkedIn
  {
    id: "li-1",
    name: "Dr. Marcus Vance",
    phone: "+44 20 7946 0192",
    time: "2026-05-29 09:15 AM",
    status: "Scheduled",
    platform: "linkedin",
    notes: "Enterprise integration consulting contract slot under review.",
    customer_name: "Dr. Marcus Vance",
    customer_phone: "+44 20 7946 0192",
    booking_date: "2026-05-29",
    booking_time: "09:15 AM",
    booking_status: "Scheduled"
  },
  {
    id: "li-2",
    name: "Deepak Patel",
    phone: "+91 98250 12345",
    time: "2026-05-29 05:45 PM",
    status: "Processing",
    platform: "linkedin",
    notes: "Executive partner request forwarded automatically from post engagement filter.",
    customer_name: "Deepak Patel",
    customer_phone: "+91 98250 12345",
    booking_date: "2026-05-29",
    booking_time: "05:45 PM",
    booking_status: "Processing"
  },
  // Facebook
  {
    id: "fb-1",
    name: "Carlos Rodriguez",
    phone: "+34 600 123 456",
    time: "2026-05-30 01:00 PM",
    status: "Scheduled",
    platform: "facebook",
    notes: "Automated booking confirmation from regional franchise messenger service.",
    customer_name: "Carlos Rodriguez",
    customer_phone: "+34 600 123 456",
    booking_date: "2026-05-30",
    booking_time: "01:00 PM",
    booking_status: "Scheduled"
  },
  {
    id: "fb-2",
    name: "Emily Johnson",
    phone: "+1 206 555 7890",
    time: "2026-05-30 06:15 PM",
    status: "Pending",
    platform: "facebook",
    notes: "Client requested local warehouse store location lookup options.",
    customer_name: "Emily Johnson",
    customer_phone: "+1 206 555 7890",
    booking_date: "2026-05-30",
    booking_time: "06:15 PM",
    booking_status: "Pending"
  },
  // Voice Agent
  {
    id: "va-1",
    name: "Giuseppe Rossi",
    phone: "+39 02 4859 1122",
    time: "2026-05-26 11:00 AM",
    status: "Completed",
    platform: "voice",
    notes: "Simulated Call complete. Dial-in Option 1 input: Rescheduled noon callback slot successfully.",
    customer_name: "Giuseppe Rossi",
    customer_phone: "+39 02 4859 1122",
    booking_date: "2026-05-26",
    booking_time: "11:00 AM",
    booking_status: "Completed"
  },
  {
    id: "va-2",
    name: "Noura Al-Ahmad",
    phone: "+971 4 362 5111",
    time: "2026-05-27 03:00 PM",
    status: "Scheduled",
    platform: "voice",
    notes: "Low-latency vocal greeting active. Confirmed attendance update.",
    customer_name: "Noura Al-Ahmad",
    customer_phone: "+971 4 362 5111",
    booking_date: "2026-05-27",
    booking_time: "03:00 PM",
    booking_status: "Scheduled"
  }
];

export default function UnifiedInbox({ profile, onUpdateProfile, onNavigate, onSignIn }: UnifiedInboxProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>("whatsapp");
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("chatflux_bookings_cache");
    return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  
  // Supabase Config state
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const saved = localStorage.getItem("chatflux_supabase_config");
    return saved ? JSON.parse(saved) : { url: "", anonKey: "", tableName: "bookings" };
  });
  
  const [showConfig, setShowConfig] = useState(true);
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [supabaseSuccess, setSupabaseSuccess] = useState(false);
  const [hasAutoFetched, setHasAutoFetched] = useState(false);

  // Backend integration status checking
  const [backendStatus, setBackendStatus] = useState({
    supabaseConfigured: false,
    supabaseUrl: "",
    supabaseTableName: "bookings",
    n8nConfigured: false,
    n8nWebhookUrl: ""
  });

  const fetchBackendStatus = async () => {
    try {
      const res = await fetch("/api/integration-status");
      if (res.ok) {
        const data = await res.json();
        setBackendStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch backend integration status:", err);
    }
  };

  useEffect(() => {
    fetchBackendStatus();
  }, []);

  // n8n AI Brain Config state
  const [n8nConfig, setN8nConfig] = useState<N8NBrainConfig>(() => {
    const saved = localStorage.getItem("chatflux_n8n_config");
    return saved ? JSON.parse(saved) : { 
      webhookUrl: "", 
      authorizationHeader: "", 
      aiModelName: "Gemini 2.5 Pro", 
      enabled: true 
    };
  });

  const [showN8NConfig, setShowN8NConfig] = useState(true);
  const [n8nTestPayload, setN8nTestPayload] = useState(
    "Hi ChatFlux, I want to book an appointment for Dr. Marcus Vance tomorrow at 10:15 AM. Phone number is +44 20 7946 0192. Looking forward!"
  );
  const [n8nLogs, setN8nLogs] = useState<string[]>([]);
  const [n8nTriggerLoading, setN8nTriggerLoading] = useState(false);
  const [n8nTriggerError, setN8nTriggerError] = useState<string | null>(null);
  const [n8nTriggerSuccess, setN8nTriggerSuccess] = useState(false);

  // Hook to save n8nConfig
  useEffect(() => {
    localStorage.setItem("chatflux_n8n_config", JSON.stringify(n8nConfig));
  }, [n8nConfig]);

  // AI Voice simulator state
  const [isDialing, setIsDialing] = useState(false);
  const [voiceStep, setVoiceStep] = useState<"not_started" | "welcome" | "menu" | "option_selected" | "transferring">("not_started");
  const [selectedIVROption, setSelectedIVROption] = useState<string | null>(null);
  const [voiceCallLogs, setVoiceCallLogs] = useState<string[]>([]);
  const [userPromptInput, setUserPromptInput] = useState("");

  // Save bookings to local storage
  useEffect(() => {
    localStorage.setItem("chatflux_bookings_cache", JSON.stringify(bookings));
  }, [bookings]);

  // Set default selected booking on platform change
  useEffect(() => {
    const filtered = bookings.filter(b => b.platform === selectedPlatform);
    if (filtered.length > 0) {
      setSelectedBooking(filtered[0]);
    } else {
      setSelectedBooking(null);
    }
  }, [selectedPlatform, bookings]);

  // Trigger real Supabase Fetch for WhatsApp only through secure backend routes
  const handleFetchSupabase = async () => {
    setSupabaseLoading(true);
    setSupabaseError(null);
    setSupabaseSuccess(false);

    try {
      // Re-query backend configuration status to check for dynamic updates
      const checkRes = await fetch("/api/integration-status");
      const checkData = await checkRes.json();
      setBackendStatus(checkData);

      if (!checkData.supabaseConfigured) {
        throw new Error("Supabase is not configured on your server backend. Please declare SUPABASE_URL and SUPABASE_ANON_KEY inside your server environment variables to query real data securely.");
      }

      const response = await fetch("/api/supabase/bookings");
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to query booking records from secure server endpoint.");
      }

      const data = json.data;
      if (data) {
        if (data.length === 0) {
          // Empty table handles elegantly by clearing WhatsApp list without showing an error
          setBookings(prev => {
            const nonWhatsApp = prev.filter(b => b.platform !== "whatsapp");
            return nonWhatsApp;
          });
          setSupabaseSuccess(true);
          setTimeout(() => setShowConfig(false), 2000);
          return;
        }

        // Map raw data safely with dynamic, case-insensitive, key-agnostic headers extractor
        const mapped: Booking[] = data.map((item: any) => {
          const selectField = (preferKeys: string[], defaultVal: string) => {
            const keys = Object.keys(item);
            for (const preferred of preferKeys) {
              const matchedKey = keys.find(k => k.toLowerCase() === preferred.toLowerCase());
              if (matchedKey && item[matchedKey] !== undefined && item[matchedKey] !== null) {
                return item[matchedKey];
              }
            }
            return defaultVal;
          };

          const rawCustName = selectField(["customer_name", "name", "client_name", "username", "first_name", "client", "title", "contact_name"], "Anonymous Client");
          const rawCustPhone = selectField(["customer_phone", "phone_number", "phone", "mobile", "tel", "contact", "phone_no"], "Unknown Number");
          
          const rawBookingDate = selectField(["booking_date", "date", "scheduled_date", "appointment_date", "booking_day"], "");
          const rawBookingTime = selectField(["booking_time", "time", "scheduled_time", "appointment_time", "booking_hour"], "");
          const combinedTime = selectField(["time", "appointment", "created_at", "scheduled_at", "datetime"], "Unscheduled");
          
          let parsedDate = rawBookingDate.toString();
          let parsedTime = rawBookingTime.toString();
          
          if (!parsedDate || !parsedTime) {
            const combinedStr = combinedTime.toString();
            if (combinedStr && combinedStr !== "Unscheduled") {
              const delimiter = combinedStr.includes("T") ? "T" : " ";
              const parts = combinedStr.split(delimiter);
              if (!parsedDate) {
                parsedDate = parts[0] || combinedStr;
              }
              if (!parsedTime) {
                parsedTime = parts[1] ? parts[1].replace("Z", "") : combinedStr;
              }
            } else {
              if (!parsedDate) parsedDate = "Unscheduled Date";
              if (!parsedTime) parsedTime = "Unscheduled Time";
            }
          }

          const statusVal = selectField(["booking_status", "status", "state", "stage"], "Pending");
          const notes = selectField(["notes", "note", "message", "message_content", "details", "comment", "description", "enquiry"], "Live WhatsApp booking synced from database.");

          return {
            id: (item.id || Math.random()).toString(),
            name: rawCustName.toString(),
            phone: rawCustPhone.toString(),
            time: `${parsedDate} ${parsedTime}`.trim(),
            status: (statusVal as BookingStatus) || "Pending",
            platform: "whatsapp",
            notes: notes.toString(),
            
            customer_name: rawCustName.toString(),
            customer_phone: rawCustPhone.toString(),
            booking_date: parsedDate,
            booking_time: parsedTime,
            booking_status: statusVal.toString()
          };
        });

        // Replace WhatsApp static entries with fully persistent Supabase entries, whilst keeping other static platforms
        setBookings(prev => {
          const nonWhatsApp = prev.filter(b => b.platform !== "whatsapp");
          return [...mapped, ...nonWhatsApp];
        });

        setSupabaseSuccess(true);
        setTimeout(() => setShowConfig(false), 2000);
      }
    } catch (err: any) {
      console.error(err);
      setSupabaseError(err.message || "Failed to query server database.");
    } finally {
      setSupabaseLoading(false);
    }
  };

  // Auto-fetch Supabase data once configured safely on mount/detection
  useEffect(() => {
    if (backendStatus.supabaseConfigured && !hasAutoFetched) {
      setHasAutoFetched(true);
      handleFetchSupabase();
    }
  }, [backendStatus.supabaseConfigured, hasAutoFetched]);

  const resetWhatsAppCache = () => {
    setBookings(prev => {
      const nonWhatsApp = prev.filter(b => b.platform !== "whatsapp");
      const defaultWA = DEFAULT_BOOKINGS.filter(b => b.platform === "whatsapp");
      return [...defaultWA, ...nonWhatsApp];
    });
    setSupabaseSuccess(false);
    setSupabaseError(null);
  };

  const handleTriggerN8NWebhook = async () => {
    setN8nTriggerLoading(true);
    setN8nTriggerError(null);
    setN8nTriggerSuccess(false);
    
    const timestampLog = new Date().toISOString().substring(11, 19);
    setN8nLogs([
      `[${timestampLog}] 🔌 Initiating secure client handshake connection to backend server...`,
      `[${timestampLog}] 📦 Encapsulating conversational test payload...`
    ]);

    const payload = {
      message_content: n8nTestPayload,
      sender_phone: "+39 333 456 7891",
      incoming_platform: selectedPlatform,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch("/api/n8n/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      
      if (json.logs && Array.isArray(json.logs)) {
        setN8nLogs(json.logs);
      } else {
        setN8nLogs(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] Received generic server response.`]);
      }

      if (!response.ok) {
        throw new Error(json.error || "Failed to complete secure server side webhook execution.");
      }

      if (json.data) {
        setBookings(prev => {
          const nonMatching = prev.filter(b => b.id !== json.data.id);
          return [json.data, ...nonMatching];
        });
        setSelectedBooking(json.data);
        setN8nTriggerSuccess(true);
      }
    } catch (err: any) {
      console.error(err);
      setN8nTriggerError(err.message || "Failed to execute workflow.");
      setN8nLogs(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] ⚠️ Fail state triggered on server: ${err.message}`]);
    } finally {
      setN8nTriggerLoading(false);
    }
  };

  // Status Toggler
  const handleUpdateStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Export as CVS
  const handleExportCSV = () => {
    const platformData = bookings.filter(b => b.platform === selectedPlatform);
    if (platformData.length === 0) {
      alert("No customer indices present to export.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Phone Number,Booking Date,Status,Source Platform,Notes\n";

    platformData.forEach(row => {
      const safeNotes = (row.notes || "").replace(/"/g, '""');
      csvContent += `"${row.id}","${row.name}","${row.phone}","${row.time}","${row.status}","${row.platform.toUpperCase()}","${safeNotes}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chatflux_${selectedPlatform}_leads.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulated vocal speech using browser SpeechSynthesis
  const speakAI = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const sentence = new SpeechSynthesisUtterance(text);
      sentence.rate = 1.0;
      sentence.pitch = 1.1;
      
      // Try to find an English female/robot-friendly voice
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.includes("en-US") || v.lang.includes("en-GB"));
      if (engVoice) {
        sentence.voice = engVoice;
      }
      
      window.speechSynthesis.speak(sentence);
    }
  };

  // Start IVR simulated call agent
  const startIVRCallAndSpeak = (step: typeof voiceStep, extraText = "") => {
    setVoiceStep(step);
    let spokenText = "";

    if (step === "welcome") {
      spokenText = "Thank you for calling Chat Flux Customer Support Line. Dial system online. Press 1 for scheduling a booking callback. Press 2 to listen to corporate scheduling hours. Or press 3 to speak with our AI agent advisor.";
      setVoiceCallLogs([
        "📞 INCOMING CALL ANSWERED - AI Voice Bot Live",
        "🔊 Voice Agent: '" + spokenText + "'"
      ]);
    } else if (step === "option_selected" && extraText === "1") {
      spokenText = "Excellent selection. Your phone number has been recorded automatically in our systems list. Press any other key to return to our core dial options.";
      setVoiceCallLogs(prev => [
        ...prev,
        "⌨ User pressed key: [ 1 ]",
        "🔊 Voice Agent: '" + spokenText + "'",
        "📝 Action Synced: Created new tracker record locally!"
      ]);
      
      // Auto create a callback booking element under Voice Agent platform!
      const randomId = "va-auto-" + Math.floor(Math.random() * 1000);
      const newBooking: Booking = {
        id: randomId,
        name: "IVR Callback Lead",
        phone: "+39 02 simulated",
        time: "Next Available Slot Today",
        status: "Pending",
        platform: "voice",
        notes: "Automated IVR choice 1 confirmed. User scheduled call queue callback.",
        customer_name: "IVR Callback Lead",
        customer_phone: "+39 02 simulated",
        booking_date: "Today",
        booking_time: "Next Available Slot",
        booking_status: "Pending"
      };
      setBookings(prev => [newBooking, ...prev]);
    } else if (step === "option_selected" && extraText === "2") {
      spokenText = "Our core operation centers run Monday to Friday, from 9:00 AM to 6:00 PM Central time. Direct sheet exports are available on the dashboard. Thank you.";
      setVoiceCallLogs(prev => [
        ...prev,
        "⌨ User pressed key: [ 2 ]",
        "🔊 Voice Agent: '" + spokenText + "'"
      ]);
    } else if (step === "option_selected" && extraText === "3") {
      spokenText = "Please leave your prompt after the tone. High proficiency AI models are processing input.";
      setVoiceCallLogs(prev => [
        ...prev,
        "⌨ User pressed key: [ 3 ]",
        "🔊 Voice Agent: '" + spokenText + "'",
        "🎙 Transcription recording activated..."
      ]);
    } else if (step === "transferring") {
      spokenText = "Transferring call routing to representative. Goodbye.";
      setVoiceCallLogs(prev => [
        ...prev,
        "🔀 Redirecting line",
        "🔊 Voice Agent: '" + spokenText + "'",
        "🔒 Connection closed safely"
      ]);
      setTimeout(() => setIsDialing(false), 3000);
    }

    if (spokenText) {
      speakAI(spokenText);
    }
  };

  const handleCustomVoiceInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPromptInput.trim()) return;
    
    const userPrompt = userPromptInput;
    setUserPromptInput("");
    
    setVoiceCallLogs(prev => [...prev, `👤 User: "${userPrompt}"`]);
    
    // Simulate AI thinking and replying
    setTimeout(() => {
      const responseText = `I have recorded your request to evaluate: "${userPrompt}". We have confirmed your phone tracker slot. Status set to pending.`;
      setVoiceCallLogs(prev => [...prev, `🔊 Voice Agent: "${responseText}"`]);
      speakAI(responseText);
      
      // Add booking dynamically based on input
      const randomId = "va-user-" + Math.floor(Math.random() * 1000);
      const nameVal = userPrompt.length > 20 ? userPrompt.substring(0, 18) + "..." : userPrompt;
      const newBooking: Booking = {
        id: randomId,
        name: nameVal,
        phone: "Voice Stream User",
        time: "ASAP Callback Scheduled",
        status: "Processing",
        platform: "voice",
        notes: `AI Voice agent analysis: "${userPrompt}"`,
        customer_name: nameVal,
        customer_phone: "Voice Stream User",
        booking_date: "Today",
        booking_time: "ASAP",
        booking_status: "Processing"
      };
      setBookings(prev => [newBooking, ...prev]);
    }, 1200);
  };

  const filteredBookings = bookings.filter(b => {
    if (b.platform !== selectedPlatform) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.name.toLowerCase().includes(q) || b.phone.includes(q) || (b.notes && b.notes.toLowerCase().includes(q));
  });

  if (!profile.loggedIn) {
    return (
      <div id="auth-gate-container" className="w-full relative py-12 md:py-20 px-4 md:px-12 max-w-2xl mx-auto space-y-8 font-body animate-fade-in">
        <div className="text-center space-y-3">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#FAF2EA] bg-neutral-charcoal border border-neutral-charcoal px-2.5 py-1">
            🔒 SESSION LOCKED // SECURE NODE
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-black text-neutral-charcoal tracking-tight flex items-center justify-center gap-2">
            <ShieldAlert className="w-8 h-8 text-primary-terracotta shrink-0" />
            Inbox Locked
          </h1>
          <p className="font-body text-xs text-[#605850] max-w-md mx-auto">
            To safeguard your integration parameters, custom Supabase secrets, and customer booking data, you must be authenticated first.
          </p>
        </div>

        <div className="bg-white border rounded-sm border-neutral-charcoal p-8 warm-shadow space-y-6 text-center">
          <p className="text-xs text-neutral-charcoal/80 leading-relaxed font-body">
            You are attempting to access the <strong>Unified Client Booking Inbox</strong> as a guest. 
            Without a secure workspace identity (Google OAuth session), we cannot safely decrypt your integration pathways, map live database queues, or persist your real-time agent settings.
          </p>

          <div className="p-4 bg-[#FAF2EA] border border-neutral-charcoal text-[11px] text-neutral-charcoal/80 text-left leading-relaxed space-y-2">
            <strong className="text-xs font-bold text-neutral-[#C2652A] uppercase block">🛡️ Security Mandate // Why OAuth is used here:</strong>
            <p className="font-body leading-normal">
              OAuth 2.0 delegating protocols authenticate your session without passing your email or main user passwords to this portal. Modern API endpoints demand signed secure session IDs to query backend tables without risking cross-tenant data sniffing, letting you manage client databases with confidence.
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => {
                if (onSignIn) {
                  onSignIn();
                } else {
                  // Backwards compatible fallback
                  onUpdateProfile({
                    name: "Nandini",
                    email: "nandini4372@gmail.com",
                    avatar: "https://lh3.googleusercontent.com/a/default-user=s120-c",
                    loggedIn: true,
                  });
                }
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-terracotta text-white font-mono text-xs md:text-sm font-bold uppercase tracking-wider border border-neutral-charcoal warm-shadow hover:translate-y-[-2px] hover:bg-amber-800 transition-all cursor-pointer inline-flex"
            >
              <LogIn className="w-4 h-4" /> Sign In with Google Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="unified-inbox-dashboard" className="w-full relative py-6 md:py-10 max-w-7xl mx-auto px-4 md:px-8 space-y-8 font-body">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white border border-neutral-charcoal warm-shadow gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-charcoal">
              ChatFlux Tracking Inbox
            </h1>
          </div>
          <p className="font-mono text-[10px] text-neutral-charcoal/60 uppercase font-bold">
            Multi-Platform Client Dashboard // Connected: {profile.loggedIn ? profile.email : "Guest Account"}
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle Buttons */}
          <div className="flex items-center border border-neutral-charcoal rounded-sm overflow-hidden text-xs font-mono font-bold bg-[#FAF2EA] select-none shadow-sm h-9">
            <button
              onClick={() => setViewMode("table")}
              id="view-mode-table"
              className={`px-3.5 h-full flex items-center gap-1.5 cursor-pointer uppercase transition-all ${
                viewMode === "table"
                  ? "bg-[#C2652A] text-white"
                  : "text-neutral-charcoal hover:bg-neutral-100"
              }`}
            >
              📊 Table
            </button>
            <button
              onClick={() => setViewMode("card")}
              id="view-mode-card"
              className={`px-3.5 h-full flex items-center gap-1.5 cursor-pointer uppercase transition-all ${
                viewMode === "card"
                  ? "bg-[#C2652A] text-white"
                  : "text-neutral-charcoal hover:bg-neutral-100"
              }`}
            >
              🗂 Cards
            </button>
          </div>

          {/* Integration Config Toggles */}
          <div className="flex flex-wrap gap-2 items-center">
            {selectedPlatform === "whatsapp" && (
              <button
                onClick={() => {
                  setShowConfig(!showConfig);
                  if (!showConfig) setShowN8NConfig(false);
                }}
                id="btn-toggle-config"
                className={`px-3 h-9 font-mono text-xs font-bold uppercase tracking-wider border border-neutral-charcoal warm-shadow flex items-center gap-2 cursor-pointer transition-all active:translate-y-[1px] ${
                  showConfig ? "bg-[#C2652A] text-white" : "bg-[#FAF2EA] hover:bg-amber-50 text-neutral-charcoal"
                }`}
              >
                <Database className="w-3.5 h-3.5 text-primary-terracotta" />
                Configure Supabase
              </button>
            )}

            <button
              onClick={() => {
                setShowN8NConfig(!showN8NConfig);
                if (!showN8NConfig) setShowConfig(false);
              }}
              id="btn-toggle-n8n-config"
              className={`px-3 h-9 font-mono text-xs font-bold uppercase tracking-wider border border-neutral-charcoal warm-shadow flex items-center gap-2 cursor-pointer transition-all active:translate-y-[1px] ${
                showN8NConfig ? "bg-primary-terracotta text-white font-bold" : "bg-[#FAF2EA] hover:bg-amber-50 text-neutral-charcoal"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              🧠 n8n AI Brain
            </button>
          </div>

          {/* Export CSV sheet link */}
          <button
            onClick={handleExportCSV}
            id="btn-export-csv"
            className="px-3 h-9 bg-[#FAF2EA] hover:bg-neutral-50 text-neutral-charcoal font-mono text-xs font-bold uppercase tracking-wider border border-neutral-charcoal warm-shadow flex items-center gap-2 cursor-pointer active:translate-y-[1px]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CRM Data
          </button>
        </div>
      </div>

      {/* Supabase Live configuration panel */}
      {selectedPlatform === "whatsapp" && showConfig && (
        <div id="database-connection-panel" className="bg-white border rounded-sm p-6 border-neutral-charcoal warm-shadow space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-charcoal pb-3">
            <div className="flex items-center gap-2 text-primary-terracotta">
              <Database className="w-5 h-5 text-[#C2652A]" />
              <h3 className="font-display text-base font-bold uppercase tracking-tight text-neutral-charcoal">
                Supabase Server-Side Database Integration Setup
              </h3>
            </div>
            <button
              onClick={() => setShowConfig(false)}
              className="text-xs font-mono font-bold text-neutral-charcoal/70 hover:text-neutral-charcoal hover:underline"
            >
              [Hide Setup Guide]
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div className="p-3.5 border rounded-sm bg-[#FAF2EA]/40 border-neutral-charcoal/50 text-xs font-body text-neutral-charcoal space-y-2">
                <span className="font-mono text-[9px] uppercase font-bold text-[#C2652A] block">🔌 BACKEND ROUTING ADVANTAGE</span>
                <p className="leading-relaxed">
                  Your Supabase credentials are processed entirely on the <strong>Node.js backend server</strong>. 
                  This eliminates browser client-side database token exposures, provides complete confidentiality, and circumvents browser CORS blocks automatically.
                </p>
              </div>

              <div className="p-4 border rounded-sm border-neutral-charcoal bg-[#FAF2EA]/10 text-xs font-body text-neutral-charcoal space-y-2">
                <p className="font-bold text-neutral-charcoal">Automatic Case-Agnostic Column Mapping:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono leading-normal text-neutral-charcoal/90">
                  <div>• <strong>Customer Name:</strong> client_name, name, customer_name, username</div>
                  <div>• <strong>Phone Number:</strong> phone_number, customer_phone, phone, tel</div>
                  <div>• <strong>Scheduled Time:</strong> created_at, scheduled_at, booking_date, time</div>
                  <div>• <strong>Comments/Notes:</strong> notes, message_content, details, enquiry</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 border rounded-sm border-neutral-charcoal bg-white flex flex-col justify-between h-full space-y-3 min-h-[160px]">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-neutral-charcoal/60">INTEGRATION STATUS</span>
                  {backendStatus.supabaseConfigured ? (
                    <div className="text-emerald-700 font-mono text-[11px] font-bold flex items-center gap-1.5 p-1 bg-emerald-50 rounded-sm">
                      <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-pulse" />
                      <span>SECURED & ACTIVE</span>
                    </div>
                  ) : (
                    <div className="text-amber-700 font-mono text-[11px] font-bold flex items-center gap-1.5 p-1 bg-amber-50 rounded-sm">
                      <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                      <span>DEMO SANDBOX ACTIVE</span>
                    </div>
                  )}
                </div>

                <div className="text-xs space-y-1 leading-snug">
                  <p className="font-mono text-[10px] uppercase font-bold text-neutral-charcoal/60">TARGET TABLE</p>
                  <p className="font-bold font-mono">"{backendStatus.supabaseTableName}"</p>
                </div>

                {!backendStatus.supabaseConfigured && (
                  <p className="text-[10px] text-neutral-charcoal/60 leading-tight">
                    💡 Register <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> inside your host server's <code>.env</code> file to sync custom tables dynamically.
                  </p>
                )}
              </div>
            </div>
          </div>

          {supabaseError && (
            <div className="p-3.5 bg-red-50 border border-red-300 text-red-950 font-body text-xs space-y-1 rounded-sm">
              <div className="flex items-center gap-2 font-bold text-red-900">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>Backend Database Sync Unsuccessful</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90 pl-6">
                <strong>Error:</strong> {supabaseError}
              </p>
              <div className="pl-6 pt-1 text-[10px] text-neutral-charcoal/80 space-y-0.5">
                <p>💡 <em>Troubleshooting:</em> Ensure the table name configured in <code>SUPABASE_TABLE_NAME</code> (currently default: <strong>{backendStatus.supabaseTableName}</strong>) exists on your Supabase dashboard and permits select privileges to Anon roles.</p>
              </div>
            </div>
          )}

          {supabaseSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-[#A7F3D0] text-emerald-950 font-body text-xs flex items-center gap-2 rounded-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-900">Success! Synchronized Live Dataset Successfully</p>
                <p className="text-[11px] text-emerald-800">Your table has been fully queried and mapped to your live WhatsApp leads feed in real-time.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between items-center border-t border-neutral-charcoal/20 pt-4">
            <button
              onClick={resetWhatsAppCache}
              className="w-full sm:w-auto px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-charcoal font-mono text-xs font-bold uppercase border border-neutral-charcoal rounded-sm cursor-pointer transition-colors"
            >
              Reset to Sandbox Defaults
            </button>
            
            <button
              onClick={() => handleFetchSupabase()}
              disabled={supabaseLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#C2652A] hover:bg-amber-800 text-white font-mono text-xs font-bold uppercase tracking-wider border border-neutral-charcoal rounded-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm transition-colors active:translate-y-[1px]"
            >
              {supabaseLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Querying Backend...
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  Sync Live Database Table
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* n8n AI Brain Orchestration Hub Panel */}
      {showN8NConfig && (
        <div id="n8n-configuration-panel" className="bg-white border rounded-sm p-6 border-neutral-charcoal warm-shadow space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-charcoal pb-3">
            <div className="flex items-center gap-2 text-primary-terracotta">
              <Sparkles className="w-5 h-5 text-primary-terracotta animate-pulse" />
              <h3 className="font-display text-base font-bold uppercase tracking-tight text-neutral-charcoal">
                🧠 n8n AI Brain Orchestration Hub
              </h3>
            </div>
            <button
              onClick={() => setShowN8NConfig(false)}
              className="text-xs font-mono font-bold text-neutral-charcoal/70 hover:text-neutral-charcoal hover:underline"
            >
              [Hide Setup Hub]
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Column 1: Explainer & Architectural Flow */}
            <div className="space-y-4 text-xs font-body leading-relaxed">
              <div className="bg-[#FAF2EA] p-4 border border-neutral-charcoal">
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#FAF2EA] bg-primary-terracotta px-2 py-0.5 rounded-sm">
                  ARCHITECTURAL CORE // SERVER HANDOFF
                </span>
                <p className="font-bold text-[#C2652A] mt-2 mb-1.5 uppercase text-[11px]">
                  Connecting Conversational AI to Database Transactions
                </p>
                <p className="text-neutral-charcoal/90 leading-normal">
                  n8n acts as the "AI Brain" mediator. Since client browsers cannot natively trigger webhooks securely without leaking authorization secrets, all pipeline handshakes have been migrated to the <strong>Express server backend</strong>.
                </p>
                <div className="mt-2 pl-3 border-l-2 border-[#C2652A] py-1 text-neutral-charcoal/80 italic text-[11px] space-y-1">
                  <div>1. 📲 Raw payload is sent to <code>/api/n8n/trigger</code> endpoint.</div>
                  <div>2. 🧠 Sent directly to active <code>Gemini LLM</code> models or your live custom n8n instance.</div>
                  <div>3. 🗃️ Parsed JSON is written automatically to database tables.</div>
                  <div>4. 📈 Mapped results instantly update the live Unified Inbox interface.</div>
                </div>
              </div>

              {/* Copyable n8n workflow spec */}
              <div className="space-y-2">
                <h4 className="font-mono text-[10px] font-bold uppercase text-neutral-charcoal opacity-70">
                  🏷️ Expected n8n Webhook JSON spec
                </h4>
                <p className="text-[11px] text-neutral-charcoal/80">
                  Configure your n8n LLM Node or active webhook to parse unstructured customer entries into this structured schema:
                </p>
                <pre className="p-3 bg-neutral-900 text-[#FAF2EA] font-mono text-[10px] rounded-sm overflow-x-auto leading-normal">
{`{
  "customer_name": "Marcus Vance",
  "customer_phone": "+44 20 7946 0192",
  "booking_date": "2026-05-27",
  "booking_time": "10:15 AM",
  "booking_status": "Pending",
  "notes": "Interested in custom CRM automation."
}`}
                </pre>
              </div>
            </div>

            {/* Column 2: Status & Sandbox Playground */}
            <div className="space-y-4">
              <div className="p-4 border rounded-sm border-neutral-charcoal bg-white space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold text-neutral-charcoal/60 block">AI ORCHESTRATION PIPELINE STATUS</span>
                {backendStatus.n8nConfigured ? (
                  <div className="space-y-1">
                    <div className="text-emerald-700 font-mono text-[11px] font-bold flex items-center gap-1.5 p-1.5 bg-emerald-50 rounded-sm inline-flex">
                      <span className="w-2 bg-emerald-600 h-2 rounded-full animate-pulse" />
                      <span>CUSTOM WEBHOOK ROUTING ACTIVE</span>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-charcoal/70 break-all bg-neutral-50 p-1">
                      Endpoint: {backendStatus.n8nWebhookUrl}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-amber-700 font-mono text-[11px] font-bold flex items-center gap-1.5 p-1.5 bg-amber-50 rounded-sm inline-flex">
                      <span className="w-2 bg-amber-500 h-2 rounded-full" />
                      <span>SERVER-SIDE COMPASS AI STANDBY</span>
                    </div>
                    <p className="text-[10px] text-neutral-charcoal/60 leading-tight">
                      To integrate custom n8n webhooks, specify <code>N8N_WEBHOOK_URL</code> in your backend environment variables (secrets). Server-side AI models will execute fallbacks.
                    </p>
                  </div>
                )}
              </div>

              {/* Webhook AI playground */}
              <div className="mt-4 p-4 border border-neutral-charcoal bg-[#FAF2EA]/30 space-y-3 rounded-sm">
                <span className="font-mono text-[10px] uppercase font-bold text-[#C2652A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Live Webhook & Server AI Test Playground
                </span>
                <p className="text-[11px] text-neutral-charcoal opacity-95">
                  Type unformatted customer message text below to execute the server parser flow:
                </p>
                <textarea
                  value={n8nTestPayload}
                  onChange={e => setN8nTestPayload(e.target.value)}
                  placeholder="Paste unstructured user text..."
                  rows={2}
                  className="w-full text-xs p-2.5 bg-white border border-neutral-charcoal font-sans outline-none focus:ring-1 focus:ring-[#C2652A]"
                />

                <button
                  onClick={handleTriggerN8NWebhook}
                  disabled={n8nTriggerLoading}
                  className="w-full py-2 bg-[#C2652A] hover:bg-amber-800 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wide border border-neutral-charcoal cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  {n8nTriggerLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading Server Handshake...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Test Webhook & Run AI Extraction
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sandbox console output */}
          {(n8nLogs.length > 0 || n8nTriggerSuccess) && (
            <div className="space-y-2 mt-4 border-t border-neutral-charcoal/10 pt-4">
              <span className="font-mono text-[10px] uppercase font-bold text-neutral-charcoal opacity-70 block">
                💻 Backend AI Brain / Webhook Pipeline Activity Feed:
              </span>
              <div className="p-4 bg-neutral-900 text-[#FAF2EA] font-mono text-[11px] space-y-1.5 rounded-sm select-text border border-neutral-charcoal overflow-x-auto max-h-60 leading-relaxed">
                {n8nLogs.map((log, index) => (
                  <div key={index} className={log.includes("⚠️") || log.includes("fail") || log.includes("Error") ? "text-amber-400" : log.includes("✅") || log.includes("complete") || log.includes("Success") ? "text-emerald-400" : "text-neutral-200"}>
                    {log}
                  </div>
                ))}
              </div>

              {n8nTriggerSuccess && (
                <div className="p-3 bg-emerald-50 border border-[#A7F3D0] text-emerald-950 text-xs flex items-center gap-2 rounded-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Extracted successfully by Server!</span> Mapped customer lead has been appended into your Unified CRM stream instantly.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Inbox Portal Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Platform Columns */}
        <div className="lg:col-span-3 space-y-3">
          <p className="font-mono text-[10px] uppercase font-bold text-neutral-charcoal/60 px-1">SELECT PIPELINE</p>
          
          <div className="space-y-1">
            {/* WhatsApp Selector */}
            <button
              onClick={() => setSelectedPlatform("whatsapp")}
              className={`w-full p-4 border text-left flex items-center justify-between rounded-sm cursor-pointer transition-all ${
                selectedPlatform === "whatsapp"
                  ? "bg-white border-primary-terracotta border-l-[6px] shadow-sm font-bold"
                  : "bg-card-cream border-neutral-charcoal opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                <span className="font-display text-sm text-neutral-charcoal">WhatsApp Cloud</span>
              </div>
              <span className="font-mono text-xs bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded-sm">
                {bookings.filter(b => b.platform === "whatsapp").length}
              </span>
            </button>

            {/* Instagram Selector */}
            <button
              onClick={() => setSelectedPlatform("instagram")}
              className={`w-full p-4 border text-left flex items-center justify-between rounded-sm cursor-pointer transition-all ${
                selectedPlatform === "instagram"
                  ? "bg-white border-primary-terracotta border-l-[6px] shadow-sm font-bold"
                  : "bg-card-cream border-neutral-charcoal opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Instagram className="w-4.5 h-4.5 text-pink-600 shrink-0" />
                <span className="font-display text-sm text-neutral-charcoal">Instagram</span>
              </div>
              <span className="font-mono text-xs bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded-sm">
                {bookings.filter(b => b.platform === "instagram").length}
              </span>
            </button>

            {/* LinkedIn Selector */}
            <button
              onClick={() => setSelectedPlatform("linkedin")}
              className={`w-full p-4 border text-left flex items-center justify-between rounded-sm cursor-pointer transition-all ${
                selectedPlatform === "linkedin"
                  ? "bg-white border-primary-terracotta border-l-[6px] shadow-sm font-bold"
                  : "bg-card-cream border-neutral-charcoal opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Linkedin className="w-4.5 h-4.5 text-blue-700 shrink-0" />
                <span className="font-display text-sm text-neutral-charcoal">LinkedIn</span>
              </div>
              <span className="font-mono text-xs bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded-sm">
                {bookings.filter(b => b.platform === "linkedin").length}
              </span>
            </button>

            {/* Facebook Selector */}
            <button
              onClick={() => setSelectedPlatform("facebook")}
              className={`w-full p-4 border text-left flex items-center justify-between rounded-sm cursor-pointer transition-all ${
                selectedPlatform === "facebook"
                  ? "bg-white border-primary-terracotta border-l-[6px] shadow-sm font-bold"
                  : "bg-card-cream border-neutral-charcoal opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Facebook className="w-4.5 h-4.5 text-indigo-700 shrink-0" />
                <span className="font-display text-sm text-neutral-charcoal">Facebook</span>
              </div>
              <span className="font-mono text-xs bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded-sm">
                {bookings.filter(b => b.platform === "facebook").length}
              </span>
            </button>

            {/* AI Voice Agent Selector */}
            <button
              onClick={() => setSelectedPlatform("voice")}
              className={`w-full p-4 border text-left flex items-center justify-between rounded-sm cursor-pointer transition-all ${
                selectedPlatform === "voice"
                  ? "bg-white border-primary-terracotta border-l-[6px] shadow-sm font-bold animate-pulse"
                  : "bg-card-cream border-neutral-charcoal opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4.5 h-4.5 text-primary-terracotta shrink-0 animate-bounce" />
                <span className="font-display text-sm text-neutral-charcoal">AI Voice Agent</span>
              </div>
              <span className="font-mono text-xs bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded-sm">
                {bookings.filter(b => b.platform === "voice").length}
              </span>
            </button>
          </div>

          <div className="p-4 bg-amber-50/50 border border-neutral-charcoal/40 text-[11px] text-neutral-charcoal/70 rounded-sm">
            <span className="font-bold">Device API Note:</span> Keep trackers active. Only WhatsApp loads custom live Supabase data; social channels remain in sandbox campaign reference mode.
          </div>
        </div>

        {/* Center Booking Trackers List Panel */}
        <div className={`${viewMode === "table" ? "lg:col-span-9" : "lg:col-span-5"} space-y-4`}>
          {viewMode !== "table" && (
            <div className="bg-white border border-neutral-charcoal p-4 rounded-sm warm-shadow flex items-center gap-2">
              <Search className="w-4 h-4 text-neutral-charcoal opacity-50 shrink-0" />
              <input
                type="text"
                placeholder={`Search clients in ${selectedPlatform.toUpperCase()}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs font-body outline-none bg-transparent"
              />
            </div>
          )}

          {viewMode === "table" ? (
            /* Database Table View */
            <div className="bg-white border border-neutral-charcoal rounded-sm p-4 md:p-6 space-y-6 shadow-sm w-full animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 pb-4">
                <div>
                  <h3 className="font-display text-sm md:text-base font-black uppercase text-neutral-charcoal tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#C2652A] rounded-full animate-ping" />
                    Database Schema Pipeline: {selectedPlatform.toUpperCase()}
                  </h3>
                  <p className="font-body text-[11px] text-neutral-charcoal/60 leading-tight">
                    Displaying exactly 5 active columns representing mapped Supabase properties. Fully responsive.
                  </p>
                </div>
                <div className="relative flex items-center bg-[#FAF2EA] border border-neutral-charcoal px-3 py-1.5 rounded-sm h-8 w-full sm:w-auto">
                  <Search className="w-3.5 h-3.5 text-neutral-charcoal opacity-50 shrink-0 mr-1.5" />
                  <input
                    type="text"
                    placeholder="Search database row..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full text-[11px] font-body outline-none bg-transparent"
                  />
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="bg-card-cream border border-neutral-charcoal rounded-sm p-12 text-center space-y-2">
                  <span className="text-2xl">📭</span>
                  <p className="font-display text-sm font-bold text-neutral-charcoal">No Database Rows Located</p>
                  <p className="font-body text-xs text-neutral-charcoal/60">
                    {selectedPlatform === "whatsapp"
                      ? "Ensure your Supabase URL, Key & Table are correct. RLS select should allow anonymous access."
                      : "Zero results found matching search parameters."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-neutral-charcoal rounded-sm">
                  <table className="w-full text-left font-body text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-[#FAF2EA] border-b border-neutral-charcoal font-mono text-[10px] uppercase font-black tracking-wider text-neutral-charcoal">
                        <th className="p-3 border-r border-[#605850]/20">customer_name</th>
                        <th className="p-3 border-r border-[#605850]/20">customer_phone</th>
                        <th className="p-3 border-r border-[#605850]/20 font-black text-[#C2652A]">booking_date</th>
                        <th className="p-3 border-r border-[#605850]/20 font-black text-[#C2652A]">booking_time</th>
                        <th className="p-3 border-r border-[#605850]/20 font-black text-[#C2652A]">booking_status</th>
                        <th className="p-3 text-center">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 bg-white">
                      {filteredBookings.map((b) => {
                        const isSelected = selectedBooking && selectedBooking.id === b.id;
                        const finalName = b.customer_name || b.name || "Anonymous Client";
                        const finalPhone = b.customer_phone || b.phone || "Unknown Number";
                        const finalDate = b.booking_date || b.time.split(" ")[0] || "Unscheduled";
                        const finalTime = b.booking_time || b.time.substring(b.time.indexOf(" ") + 1) || "Unscheduled";
                        const finalStatus = b.booking_status || b.status || "Pending";

                        return (
                          <tr
                            key={b.id}
                            onClick={() => setSelectedBooking(b)}
                            className={`group cursor-pointer transition-all hover:bg-[#FAF2EA]/30 ${
                              isSelected ? "bg-[#FAF2EA]/60 font-semibold" : ""
                            }`}
                          >
                            {/* 1) customer_name */}
                            <td className="p-3 border-r border-neutral-200 font-display font-medium text-neutral-charcoal">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-sm border border-neutral-200 bg-neutral-100 flex items-center justify-center font-bold text-[10px] text-neutral-charcoal uppercase shrink-0">
                                  {finalName.substring(0, 2)}
                                </div>
                                <span className="truncate max-w-[150px] sm:max-w-none">
                                  {finalName}
                                </span>
                              </div>
                            </td>

                            {/* 2) customer_phone */}
                            <td className="p-3 border-r border-neutral-200 font-mono text-neutral-charcoal/90">
                              {finalPhone}
                            </td>

                            {/* 3) booking_date */}
                            <td className="p-3 border-r border-neutral-200 font-mono text-neutral-charcoal/90">
                              {finalDate}
                            </td>

                            {/* 4) booking_time */}
                            <td className="p-3 border-r border-neutral-200 font-mono text-neutral-charcoal/90">
                              {finalTime}
                            </td>

                            {/* 5) booking_status */}
                            <td className="p-3 border-r border-neutral-200">
                              <span className={`inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm border ${
                                finalStatus === "Scheduled" ? "bg-emerald-50 text-emerald-800 border-emerald-300" :
                                finalStatus === "Processing" ? "bg-amber-50 text-amber-800 border-amber-300" :
                                finalStatus === "Pending" ? "bg-blue-50 text-blue-800 border-blue-300" :
                                "bg-neutral-100 text-neutral-800 border-neutral-300"
                              }`}>
                                {finalStatus}
                              </span>
                            </td>

                            {/* Actions Status Update */}
                            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1.5">
                                <select
                                  value={b.status}
                                  onChange={(e) => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                                  className="text-[10px] font-mono p-1 border border-neutral-300 bg-white rounded-sm outline-none cursor-pointer hover:border-[#C2652A] transition-colors"
                                >
                                  <option value="Scheduled">Scheduled</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Detail drawer inside table mode */}
              {selectedBooking && (
                <div className="p-5 border border-[#605850]/45 bg-[#FAF2EA]/50 rounded-sm relative shadow-inner animate-fade-in animate-[fadeIn_0.2s_ease-out]">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="absolute top-3 right-3 font-mono text-[10px] text-neutral-charcoal opacity-60 hover:opacity-100"
                  >
                    [Close Drawer]
                  </button>
                  <h4 className="font-display text-xs font-bold uppercase text-[#C2652A] pb-2 border-b border-neutral-300/60 mb-3">
                    Active Pipeline Client Record Details
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6 text-xs font-body">
                    <div>
                      <p className="opacity-60 text-[9px] font-mono font-bold uppercase">Customer Name</p>
                      <p className="font-bold text-neutral-charcoal text-sm mt-0.5">{selectedBooking.customer_name || selectedBooking.name}</p>
                      <p className="opacity-60 text-[9px] font-mono font-bold uppercase mt-3">Customer Phone</p>
                      <p className="font-mono text-neutral-charcoal mt-0.5">{selectedBooking.customer_phone || selectedBooking.phone}</p>
                    </div>
                    <div>
                      <p className="opacity-60 text-[9px] font-mono font-bold uppercase">Booking Date</p>
                      <p className="font-mono text-neutral-charcoal font-semibold mt-0.5">{selectedBooking.booking_date || selectedBooking.time.split(" ")[0]}</p>
                      <p className="opacity-60 text-[9px] font-mono font-bold uppercase mt-3">Booking Time</p>
                      <p className="font-mono text-neutral-charcoal font-semibold mt-0.5">{selectedBooking.booking_time || selectedBooking.time.substring(selectedBooking.time.indexOf(" ") + 1)}</p>
                    </div>
                    <div>
                      <p className="opacity-60 text-[9px] font-mono font-bold uppercase">Incoming Category</p>
                      <span className="font-mono font-bold text-[#C2652A] mt-0.5 block uppercase">{selectedBooking.platform}</span>
                      
                      <p className="opacity-60 text-[9px] font-mono font-bold uppercase mt-3">Pipeline Status</p>
                      <span className={`inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm border mt-1 ${
                        (selectedBooking.booking_status || selectedBooking.status) === "Scheduled" ? "bg-emerald-50 text-emerald-800 border-emerald-300" :
                        (selectedBooking.booking_status || selectedBooking.status) === "Processing" ? "bg-amber-50 text-amber-800 border-amber-300" :
                        (selectedBooking.booking_status || selectedBooking.status) === "Pending" ? "bg-blue-50 text-blue-800 border-blue-300" :
                        "bg-neutral-100 text-neutral-800 border-neutral-300"
                      }`}>
                        {selectedBooking.booking_status || selectedBooking.status}
                      </span>
                    </div>
                  </div>
                  {selectedBooking.notes && (
                    <div className="pt-3 border-t border-neutral-300/40 mt-3 text-xs">
                      <span className="font-mono text-[9px] opacity-60 font-bold uppercase text-[#605850]/70">Context Enquiry Context</span>
                      <p className="mt-1.5 font-body text-neutral-charcoal italic bg-white p-3 border border-neutral-200 rounded-sm">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Cards split default layout mode */
            <>
              {filteredBookings.length === 0 ? (
                <div className="bg-card-cream border border-neutral-charcoal rounded-sm p-8 text-center space-y-2">
                  <span className="text-xl">📭</span>
                  <p className="font-display text-sm font-bold text-neutral-charcoal">No Client Bookings Loaded</p>
                  <p className="font-body text-xs text-neutral-charcoal/60">
                    {selectedPlatform === "whatsapp" 
                      ? "Click 'Configure Supabase' to map real PostgreSQL rows, or reset parameters to sandbox defaults."
                      : "Perfect. No bookings pending for this node path at the moment."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map(b => {
                    const isSelected = selectedBooking && selectedBooking.id === b.id;
                    const finalName = b.customer_name || b.name;
                    const finalPhone = b.customer_phone || b.phone;
                    const finalDate = b.booking_date || b.time.split(" ")[0];
                    const finalTime = b.booking_time || b.time.substring(b.time.indexOf(" ") + 1);
                    const finalStatus = b.booking_status || b.status;

                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`p-4 border rounded-sm cursor-pointer hover:raise transition-all ${
                          isSelected 
                            ? "bg-white border-neutral-charcoal shadow-sm"
                            : "bg-[#FAF2EA]/70 border-neutral-charcoal/50"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1 pb-1">
                          <h4 className="font-display font-black text-sm text-neutral-charcoal tracking-tight">
                            {finalName}
                          </h4>
                          <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-sm border ${
                            finalStatus === "Scheduled" ? "bg-emerald-50 text-emerald-800 border-emerald-300" :
                            finalStatus === "Processing" ? "bg-amber-50 text-amber-800 border-amber-300" :
                            finalStatus === "Pending" ? "bg-blue-50 text-blue-800 border-blue-300" :
                            "bg-neutral-100 text-neutral-800 border-neutral-300"
                          }`}>
                            {finalStatus}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-charcoal opacity-80 pt-1 font-mono">
                          <Phone className="w-3 h-3 text-[#78706A]" />
                          <span>{finalPhone}</span>
                          <span className="opacity-40">|</span>
                          <Calendar className="w-3 h-3 text-[#78706A]" />
                          <span>{finalDate} {finalTime ? `@ ${finalTime}` : ""}</span>
                        </div>

                        {b.notes && (
                          <p className="font-body text-[11px] text-neutral-charcoal/80 pt-2 line-clamp-1 border-t border-neutral-200 mt-2">
                            {b.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Details OR Interactive Voice Simulator Panel */}
        {viewMode !== "table" && (
          <div className="lg:col-span-4 space-y-6">
          
          {selectedPlatform === "voice" ? (
            /* Interactive AI Voice Agent Simulator */
            <div className="bg-neutral-charcoal text-[#FAF2EA] border border-neutral-charcoal p-6 warm-shadow-lg space-y-6 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-neutral-500 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#FAF2EA]">
                    IVR AI Voice Call node
                  </span>
                </div>
                <Volume2 className="w-4 h-4 text-primary-terracotta" />
              </div>

              <div className="text-center py-4 space-y-3">
                <div className={`w-16 h-16 border-2 mx-auto flex items-center justify-center rounded-full transition-all ${
                  isDialing ? "bg-primary-terracotta border-[#FAF2EA] animate-pulse" : "bg-neutral-800 border-neutral-500"
                }`}>
                  <Mic className={`w-6 h-6 ${isDialing ? "text-white" : "text-neutral-400"}`} />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold uppercase">
                    {isDialing ? "IVR Call Connected" : "AI Voice Caller Offline"}
                  </h3>
                  <p className="font-mono text-[10px] text-neutral-300 uppercase">
                    Status: {isDialing ? "Streaming audio node // 8kHz" : "Click below to trigger simulated dialer"}
                  </p>
                </div>
              </div>

              {isDialing ? (
                /* Dial Active Area */
                <div className="space-y-4">
                  
                  {/* Visual wave representation */}
                  <div className="flex justify-center items-end gap-1 h-8 bg-neutral-800/80 p-2 rounded-sm border border-neutral-500/50">
                    <span className="w-1 bg-primary-terracotta h-2 animate-pulse" />
                    <span className="w-1 bg-primary-terracotta h-6 animate-pulse" style={{animationDelay: "0.2s"}} />
                    <span className="w-1 bg-[#FAF2EA] h-4 animate-pulse" style={{animationDelay: "0.4s"}} />
                    <span className="w-1 bg-[#FAF2EA] h-[10px] animate-pulse" style={{animationDelay: "0.1s"}} />
                    <span className="w-1 bg-[#C2652A] h-7 animate-pulse" style={{animationDelay: "0.3s"}} />
                    <span className="w-1 bg-white h-3 animate-pulse" style={{animationDelay: "0.5s"}} />
                  </div>

                  {/* Call Log/Transcription Area */}
                  <div className="p-3 bg-neutral-900 border border-neutral-600 rounded-sm font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto space-y-1.5 text-orange-100">
                    {voiceCallLogs.map((log, idx) => (
                      <p key={idx}>{log}</p>
                    ))}
                  </div>

                  {/* Interactive Option Keypad Menu */}
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] text-neutral-300 uppercase font-bold text-center">Interactive Keypad Options (Press below):</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => startIVRCallAndSpeak("option_selected", "1")}
                        className="p-2 text-xs bg-neutral-800 border border-neutral-500 text-center font-bold text-white hover:bg-[#C2652A] rounded-sm transition-all"
                      >
                        [ 1 ] Callback
                      </button>
                      <button
                        onClick={() => startIVRCallAndSpeak("option_selected", "2")}
                        className="p-2 text-xs bg-neutral-800 border border-neutral-500 text-center font-bold text-white hover:bg-[#C2652A] rounded-sm transition-all"
                      >
                        [ 2 ] Working Hrs
                      </button>
                      <button
                        onClick={() => startIVRCallAndSpeak("option_selected", "3")}
                        className="p-2 text-xs bg-neutral-800 border border-neutral-500 text-center font-bold text-white hover:bg-[#C2652A] rounded-sm transition-all"
                      >
                        [ 3 ] Record Prompt
                      </button>
                    </div>

                    {/* Speech Interaction Input for Option 3 */}
                    {voiceStep === "option_selected" && (
                      <form onSubmit={handleCustomVoiceInput} className="pt-2 flex gap-1">
                        <input
                          type="text"
                          placeholder="Speak into recorder..."
                          value={userPromptInput}
                          onChange={e => setUserPromptInput(e.target.value)}
                          className="flex-1 text-xs p-2 border border-neutral-500 bg-neutral-950 font-mono text-[#FAF2EA] outline-none"
                        />
                        <button
                          type="submit"
                          className="px-3 bg-primary-terracotta text-white font-mono text-[11px] font-bold uppercase hover:bg-amber-700 border border-neutral-500"
                        >
                          Send
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => startIVRCallAndSpeak("transferring")}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase tracking-widest border border-neutral-charcoal text-center cursor-pointer"
                    >
                      Route Call Flow
                    </button>
                    <button
                      onClick={() => {
                        setIsDialing(false);
                        window.speechSynthesis.cancel();
                      }}
                      className="w-full py-2 bg-tertiary-burgundy hover:bg-red-950 text-white font-mono text-xs font-bold uppercase tracking-widest border border-neutral-charcoal text-center cursor-pointer"
                    >
                      Hang Up
                    </button>
                  </div>

                </div>
              ) : (
                /* Simulated offline prompt */
                <div className="space-y-4">
                  <p className="font-body text-xs text-neutral-300 leading-relaxed">
                    Test how ChatFlux AI automatically handles incoming phone calls, schedules a client callback, and registers status tracking updates on the fly.
                  </p>
                  <button
                    onClick={() => {
                      setIsDialing(true);
                      startIVRCallAndSpeak("welcome");
                    }}
                    className="w-full py-3 bg-primary-terracotta hover:bg-amber-800 text-[#FAF2EA] font-mono text-xs font-bold uppercase tracking-widest text-center border border-neutral-charcoal warm-shadow cursor-pointer"
                  >
                    Simulate Incoming Call
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Selected Client Detail Card for other platforms */
            <div className="bg-white border rounded-sm border-neutral-charcoal p-6 warm-shadow-lg space-y-6">
              
              <div className="flex justify-between items-start border-b border-neutral-200 pb-3">
                <div className="space-y-1">
                  <p className="font-mono text-[9px] uppercase font-bold text-primary-terracotta">
                    Lead Status Detail
                  </p>
                  <h3 className="font-display text-lg font-bold text-neutral-charcoal uppercase">
                    Reference File
                  </h3>
                </div>
                <span className="font-mono text-[10px] bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-sm">
                  {selectedBooking ? selectedBooking.id : "NO SELECTION"}
                </span>
              </div>

              {selectedBooking ? (
                <div className="space-y-5">
                  <div className="space-y-4">
                    {/* Customer Info node */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-neutral-300 bg-neutral-50 flex items-center justify-center font-bold text-neutral-charcoal uppercase">
                        {selectedBooking.name.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-display font-black text-base text-neutral-charcoal leading-none">
                          {selectedBooking.name}
                        </p>
                        <p className="font-mono text-[10px] text-neutral-charcoal/60 pt-1">
                          Platform: <span className="font-bold text-primary-terracotta">{selectedBooking.platform.toUpperCase()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-b border-dashed border-neutral-200 py-3 text-xs text-neutral-charcoal font-body">
                      <div className="flex justify-between">
                        <span className="opacity-60 font-mono text-[10px] uppercase">Phone:</span>
                        <span className="font-mono font-bold">{selectedBooking.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60 font-mono text-[10px] uppercase">Scheduled Time:</span>
                        <span className="font-mono font-bold">{selectedBooking.time}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-mono text-[10px] uppercase font-bold text-neutral-charcoal opacity-60">Enquiry context details</p>
                      <p className="font-body text-xs text-neutral-charcoal/95 leading-relaxed bg-[#FAF2EA] border border-neutral-200/60 p-3 rounded-sm">
                        {selectedBooking.notes || "No context notes currently registered for this tracker profile."}
                      </p>
                    </div>
                  </div>

                  {/* Change Status Action Items */}
                  <div className="space-y-2 pt-2 border-t border-dashed border-neutral-200">
                    <p className="font-mono text-[10px] uppercase font-bold text-neutral-charcoal opacity-60">Modify Status</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["Scheduled", "Processing", "Pending", "Completed"] as BookingStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedBooking.id, status)}
                          className={`py-1.5 text-[10px] font-mono border rounded-sm transition-all uppercase font-semibold ${
                            selectedBooking.status === status
                              ? "bg-primary-terracotta border-neutral-charcoal text-white"
                              : "bg-[#FAF2EA] border-neutral-300 text-neutral-charcoal hover:bg-neutral-100"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 space-y-2 text-neutral-charcoal/50">
                  <span>👈</span>
                  <p className="font-display text-sm font-bold uppercase">No Profile Selected</p>
                  <p className="text-xs">Click on any client tracker element in the center column to map details instantly.</p>
                </div>
              )}
            </div>
          )}

          {/* Connected state information widget */}
          <div className="border border-neutral-charcoal bg-[#FAF2EA]/70 p-4 font-body text-xs text-neutral-charcoal space-y-2.5">
            <h4 className="font-display font-bold uppercase text-neutral-charcoal">Quick Platform Coverage</h4>
            <div className="space-y-1 text-[11px] leading-relaxed">
              <p>● <span className="font-semibold text-emerald-800 font-mono">[WhatsApp API]</span> is fully dynamic. Paste your custom Supabase DB anon keys to fetch active records.</p>
              <p>● <span className="font-semibold text-neutral-charcoal font-mono">[Instagram/FB/LinkedIn]</span> are simulated sandbox pools displaying campaign mock entries categorized elegantly.</p>
              <p>● <span className="font-semibold text-[#C2652A] font-mono">[IVR Voice Agent]</span> uses the browsers Speech API nodes to talk of dial choices natively on call simulations.</p>
            </div>
          </div>

        </div>
        )}

      </div>

    </div>
  );
}
