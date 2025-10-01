'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  User,
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: FirebaseError | null;
  confirmationResult: ConfirmationResult | null;
  setupRecaptcha: (phoneNumber: string) => Promise<ConfirmationResult | null>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  confirmationResult: null,
  setupRecaptcha: async () => null,
  verifyOtp: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirebaseError | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const setupRecaptcha = async (phoneNumber: string): Promise<ConfirmationResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setLoading(false);
      return result;
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e);
      }
      setLoading(false);
      return null;
    }
  };

  const verifyOtp = async (otp: string) => {
    if (!confirmationResult) {
      setError(new FirebaseError('auth/no-confirmation-result', 'No confirmation result found. Please request OTP first.'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await confirmationResult.confirm(otp);
      router.push('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    error,
    confirmationResult,
    setupRecaptcha,
    verifyOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
