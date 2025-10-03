'use client';

import { useState, useRef } from 'react';
import type { ResumeData } from '@/lib/types';
import { initialData } from '@/lib/initial-data';
import ResumeForm from '@/components/resume-form';
import ResumePreview from '@/components/resume-preview';
import { Button } from '@/components/ui/button';
import { Download, Edit, X, Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function HomePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [showMobileEditor, setShowMobileEditor] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generatePdf = async () => {
    const input = resumePreviewRef.current;
    if (!input) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Resume preview not found.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');

      if (!imgData || imgData === 'data:,') {
        throw new Error('Failed to capture resume content as an image.');
      }
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not generate PDF. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    // Check for mobile/tablet screen width
    if (window.innerWidth < 768) {
      generatePdf();
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="no-print sticky top-0 z-20 flex items-center justify-between border-b bg-gradient-to-r from-slate-900 to-slate-800/90 px-4 py-3 shadow-sm backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-xl font-bold md:text-3xl">
            Resume Builder
          </h1>
        </div>
        <div className="hidden items-center gap-4 md:flex">
           <ThemeToggle />
           <Button size="lg" onClick={handleDownload} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Download
            </Button>
        </div>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </header>
      <div className="print-container container mx-auto max-w-7xl">
        {/* Desktop Layout */}
        <main className="hidden grid-cols-1 gap-8 p-4 md:grid md:grid-cols-2 md:p-6 lg:grid-cols-[1fr_minmax(0,1.1fr)]">
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
        
        {/* Mobile Layout */}
        <main className="md:hidden">
          <div className="p-4">
             <div className="resume-preview-container rounded-lg border bg-card shadow-lg aspect-[210/297] overflow-hidden mx-auto">
                <div className="h-full overflow-auto">
                  <ResumePreview ref={resumePreviewRef} resumeData={resumeData} />
                </div>
              </div>
          </div>

          <div 
            className={cn(
              "no-print fixed inset-0 z-30 transform transition-transform duration-300 ease-in-out",
              showMobileEditor ? "translate-y-0" : "translate-y-full"
            )}
          >
            <div className="flex h-full flex-col bg-background">
               <div className="flex justify-between items-center p-4 border-b">
                 <h2 className="text-xl font-bold">Editor</h2>
                 <Button variant="ghost" size="icon" onClick={() => setShowMobileEditor(false)}>
                   <X />
                 </Button>
               </div>
               <div className="flex-grow overflow-auto p-4">
                 <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
               </div>
            </div>
          </div>

          <div className="no-print fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 md:hidden">
            <Button
              size="lg"
              className="h-12 rounded-full shadow-lg pl-5 pr-6"
              onClick={() => setShowMobileEditor(!showMobileEditor)}
            >
              <Edit className="mr-2 h-5 w-5" />
              Edit
            </Button>
            <Button
              size="lg"
              className="h-12 rounded-full shadow-lg pl-5 pr-6"
              onClick={handleDownload}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </>
              )}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
