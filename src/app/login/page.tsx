// src/app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If the user is authenticated and loading is finished, redirect to the home page.
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // We don't need to await this. The redirect will happen.
      signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Error initiating sign-in with redirect:', error);
    }
  };

  // Show a loader while the AuthProvider is determining the user's auth state.
  // Also show a loader if we know the user is logged in and we are about to redirect.
  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Only show the login page content if we are not loading and there's no user.
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
