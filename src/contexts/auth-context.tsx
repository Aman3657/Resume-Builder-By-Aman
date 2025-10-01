'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const processRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // This is the signed-in user after a redirect.
          setUser(result.user);
          router.push('/');
        }
      } catch (error) {
        console.error('Error getting redirect result:', error);
      }
      // In all cases, redirect processing is done, so we stop loading.
      // The onAuthStateChanged listener below will handle subsequent state changes.
      setLoading(false);
    };

    // We start by assuming we might be in a redirect flow.
    setLoading(true);
    processRedirect();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // We set loading to false here as well, covering the case where
      // the user was already logged in on a fresh page load (not a redirect).
      if (loading) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const login = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    // No need to set user to null here, onAuthStateChanged will handle it.
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
