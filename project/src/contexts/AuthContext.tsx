import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData, UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import type { Session, AuthError } from '@supabase/supabase-js';

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<RegisterData | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string>('');

  // Helper function to convert Supabase user + profile to our User type
  const createUserFromSupabase = (authUser: any, profile?: UserProfile): User => {
    return {
      id: authUser.id,
      email: authUser.email || '',
      fullName: profile?.full_name || authUser.user_metadata?.fullName || '',
      avatar: profile?.avatar || authUser.user_metadata?.avatar,
      role: profile?.role || authUser.user_metadata?.role || 'user',
      createdAt: new Date(authUser.created_at),
      isVerified: authUser.email_confirmed_at !== null,
      emailVerified: authUser.email_confirmed_at !== null,
      lastSignInAt: authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at) : undefined,
    };
  };

  // Get user profile from our custom profiles table
  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Create or update user profile
  const upsertUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error upserting user profile:', error);
      }
    } catch (error) {
      console.error('Error upserting user profile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getUserProfile(session.user.id).then((profile) => {
          setUser(createUserFromSupabase(session.user, profile || undefined));
        });
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        setUser(createUserFromSupabase(session.user, profile || undefined));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        const profile = await getUserProfile(data.user.id);
        setUser(createUserFromSupabase(data.user, profile || undefined));
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: { fullName?: string; role?: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        console.error('Registration error:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Create profile in our custom table
        await upsertUserProfile(data.user.id, {
          full_name: metadata?.fullName || '',
          role: (metadata?.role as 'user' | 'facility_owner' | 'admin') || 'user',
          created_at: new Date().toISOString(),
        });

                 // If email confirmation is required, set pending verification
         if (!data.user.email_confirmed_at) {
           setPendingVerification({
             email,
             password,
             fullName: metadata?.fullName || '',
             role: (metadata?.role as 'user' | 'facility_owner') || 'user',
           });
           setPendingVerificationEmail(email);
         } else {
          const profile = await getUserProfile(data.user.id);
          setUser(createUserFromSupabase(data.user, profile || undefined));
        }
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error('Password reset error:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        console.error('Password update error:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Password update error:', error);
      return false;
    }
  };

     const verifyOTP = async (email: string, token: string): Promise<boolean> => {
     setIsLoading(true);
     try {
       const { data, error } = await supabase.auth.verifyOtp({
         email,
         token,
         type: 'signup',
       });

       if (error) {
         console.error('OTP verification error:', error);
         setIsLoading(false);
         return false;
       }

       if (data.user) {
         const profile = await getUserProfile(data.user.id);
         setUser(createUserFromSupabase(data.user, profile || undefined));
         setPendingVerification(null);
         setPendingVerificationEmail('');
       }

       setIsLoading(false);
       return true;
     } catch (error) {
       console.error('OTP verification error:', error);
       setIsLoading(false);
       return false;
     }
   };

  const logout = async () => {
         try {
       await supabase.auth.signOut();
       setUser(null);
       setPendingVerification(null);
       setPendingVerificationEmail('');
     } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Legacy methods for backward compatibility
  const login = async (email: string, password: string): Promise<boolean> => {
    return signInWithEmail(email, password);
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    return signUpWithEmail(userData.email, userData.password, {
      fullName: userData.fullName,
      role: userData.role,
    });
  };

       return (
       <AuthContext.Provider value={{
         user,
         login,
         register,
         logout,
         verifyOTP,
         isLoading,
         signInWithEmail,
         signUpWithEmail,
         resetPassword,
         updatePassword,
         pendingVerificationEmail,
       }}>
         {children}
       </AuthContext.Provider>
     );
};