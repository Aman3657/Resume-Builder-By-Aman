// src/app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  if(loading || user) return <div className="flex h-screen w-full items-center justify-center">Loading...</div>

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
