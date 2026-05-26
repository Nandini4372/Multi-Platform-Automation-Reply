export type PageView = "Landing" | "Guide" | "Subscription" | "Inbox";

export type PlatformId = "whatsapp" | "instagram" | "linkedin" | "facebook" | "voice";

export type BookingStatus = "Scheduled" | "Processing" | "Pending" | "Completed";

export interface Booking {
  id: string;
  name: string;
  phone: string;
  time: string;
  status: BookingStatus;
  platform: PlatformId;
  notes?: string;
  timestamp?: string; // Standardized string representation
  
  // Custom precise requested fields
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  booking_status: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  loggedIn: boolean;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tableName: string;
}

export interface N8NBrainConfig {
  webhookUrl: string;
  authorizationHeader: string;
  aiModelName: string;
  enabled: boolean;
}

export interface IVRNode {
  id: string;
  label: string;
  prompt: string;
  options: { [key: string]: { nextNodeId: string; actionText: string } };
}
