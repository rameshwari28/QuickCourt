export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: 'user' | 'facility_owner' | 'admin';
  createdAt: Date;
  isVerified: boolean;
  // Supabase specific fields
  emailVerified?: boolean;
  lastSignInAt?: Date;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar?: string;
  role: 'user' | 'facility_owner' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  sportsTypes: string[];
  amenities: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  ownerId: string;
  isApproved: boolean;
  createdAt: Date;
}

export interface Court {
  id: string;
  venueId: string;
  name: string;
  sportType: string;
  pricePerHour: number;
  operatingHours: {
    start: string;
    end: string;
  };
  isActive: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  userName?: string;
  venueName?: string;
  courtName?: string;
  sportType?: string;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  isLoading: boolean;
  pendingVerificationEmail: string;
  // New Supabase methods
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, metadata?: { fullName?: string; role?: string }) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'facility_owner';
  avatar?: string;
}