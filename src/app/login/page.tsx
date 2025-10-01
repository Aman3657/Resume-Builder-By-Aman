// src/app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);

  useEffect(() => {
    const processRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // A redirect result has been processed. The onAuthStateChanged
          // listener in AuthProvider will handle the user state and routing.
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      } finally {
        setIsProcessingRedirect(false);
      }
    };
    processRedirect();
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Error initiating sign-in with redirect:', error);
    }
  };
  
  // This effect handles routing after the redirect is processed and user state is known.
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // We should show a loader while auth state is being determined,
  // while processing a redirect, or if we know the user is logged in
  // and are about to redirect them.
  const isLoading = authLoading || isProcessingRedirect || (!authLoading && user);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Only show the login page if we are not loading and there is no user.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
            <Logo className="h-12 w-12 text-primary" />
            <h1 className="mt-4 font-headline text-3xl font-bold">
                Resume Builder by Aman
            </h1>
            <p className="mt-2 text-muted-foreground">
                Sign in to create and manage your resumes.
            </p>
        </div>
        <div className="mt-8">
          <Button onClick={handleGoogleSignIn} size="lg" className="w-full">
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
