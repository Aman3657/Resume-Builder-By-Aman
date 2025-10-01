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
import { AuthGate } from '@/components/auth-gate';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


function HomePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const handlePrint = () => {
    window.print();
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    return names
      .map(n => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-background text-foreground">
        <header className="no-print sticky top-0 z-20 flex items-center justify-between border-b bg-background/80 px-4 py-3 shadow-sm backdrop-blur-sm md:px-6 gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl font-bold md:text-3xl">
              Resume Builder
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handlePrint} size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
    </AuthGate>
  );
}

export default function Home() {
  return <HomePage />;
}
