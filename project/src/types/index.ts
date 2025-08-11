export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: 'user' | 'facility_owner' | 'admin';
  createdAt: Date;
  isVerified: boolean;
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
  verifyOTP: (otp: string) => Promise<boolean>;
  isLoading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'facility_owner';
  avatar?: string;
}