import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    fullName: 'John Doe',
    role: 'user',
    createdAt: new Date(),
    isVerified: true,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    email: 'owner@example.com',
    fullName: 'Jane Smith',
    role: 'facility_owner',
    createdAt: new Date(),
    isVerified: true,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    email: 'admin@example.com',
    fullName: 'Admin User',
    role: 'admin',
    createdAt: new Date(),
    isVerified: true,
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState<RegisterData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('quickcourt_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('quickcourt_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    setPendingVerification(userData);
    setIsLoading(false);
    return true;
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp === '123456' && pendingVerification) {
      const newUser: User = {
        id: String(Date.now()),
        ...pendingVerification,
        createdAt: new Date(),
        isVerified: true
      };
      
      setUser(newUser);
      localStorage.setItem('quickcourt_user', JSON.stringify(newUser));
      setPendingVerification(null);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setPendingVerification(null);
    localStorage.removeItem('quickcourt_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      verifyOTP,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};