'use client';

import { useState, useRef } from 'react';
import type { ResumeData } from '@/lib/types';
import { initialData } from '@/lib/initial-data';
import ResumeForm from '@/components/resume-form';
import ResumePreview from '@/components/resume-preview';
import { Button } from '@/components/ui/button';
import { Download, LogOut } from 'lucide-react';
import { Logo } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null; // or a redirect component
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="no-print sticky top-0 z-20 flex items-center justify-between border-b bg-background/80 px-4 py-3 shadow-sm backdrop-blur-sm md:px-6 gap-4">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-2xl font-bold md:text-3xl">
            Resume Builder by Aman
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handlePrint} size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                  <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="print-container container mx-auto max-w-7xl">
        <main className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-[1fr_minmax(0,1.1fr)]">
          <div className="no-print">
            <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
          </div>
          <div className="relative">
            <div className="sticky top-[80px]">
              <div className="resume-preview-container rounded-lg border bg-card shadow-lg">
                <ResumePreview ref={resumePreviewRef} resumeData={resumeData} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
