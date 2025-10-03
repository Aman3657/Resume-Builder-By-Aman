'use client';

import { useState, useRef } from 'react';
import type { ResumeData } from '@/lib/types';
import { initialData } from '@/lib/initial-data';
import ResumeForm from '@/components/resume-form';
import ResumePreview from '@/components/resume-preview';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="no-print sticky top-0 z-20 flex items-center justify-between border-b bg-background/80 px-4 py-3 shadow-sm backdrop-blur-sm md:px-6 gap-4 bg-gradient-to-r from-background to-secondary/30">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-2xl font-bold md:text-3xl">
            Resume Builder
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <ThemeToggle />
          <Button onClick={handlePrint} size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </header>
      <div className="print-container container mx-auto max-w-7xl">
        <main className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-[1fr_minmax(0,1.1fr)]">
          <div className="no-print">
            <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
          </div>
          <div className="relative">
            <div className="sticky top-[80px]">
              <div className="resume-preview-container rounded-lg border bg-card shadow-lg aspect-[210/297] overflow-hidden">
                <div className="h-full overflow-auto">
                  <ResumePreview ref={resumePreviewRef} resumeData={resumeData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
