'use client';

import { useState, useRef } from 'react';
import type { ResumeData } from '@/lib/types';
import { initialData } from '@/lib/initial-data';
import ResumeForm from '@/components/resume-form';
import ResumePreview from '@/components/resume-preview';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Edit, X, FileImage, FileText } from 'lucide-react';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMobileEditor, setShowMobileEditor] = useState(false);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownloadPNG = async () => {
    setIsProcessing(true);
    const content = resumePreviewRef.current;
    if (!content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Resume preview content not found.",
      });
      setIsProcessing(false);
      return;
    }

    try {
      const canvas = await html2canvas(content, { 
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'resume.png';
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error('Error generating PNG:', error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to generate PNG image.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownloadPDF = async () => {
    setIsProcessing(true);
    const content = resumePreviewRef.current;
    if (!content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Resume preview content not found.",
      });
      setIsProcessing(false);
      return;
    }

    try {
        const canvas = await html2canvas(content, { 
          scale: 2,
          useCORS: true,
        });
        const imgData = canvas.toDataURL('image/png');

        if (!imgData || imgData === 'data:,') {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create image data for PDF.",
          });
          setIsProcessing(false);
          return;
        }

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
        
        pdf.save('resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to generate PDF document.",
      });
    } finally {
      setIsProcessing(false);
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
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" disabled={isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Download
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Choose Download Format</AlertDialogTitle>
                  <AlertDialogDescription>
                    You can download your resume as a high-quality PNG image or a multi-page PDF document.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center gap-4">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button onClick={handleDownloadPNG} className="w-full sm:w-auto" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileImage className="mr-2 h-4 w-4" />} Download PNG
                  </Button>
                  <AlertDialogAction onClick={handleDownloadPDF} className="w-full sm:w-auto" disabled={isProcessing}>
                     {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />} Download PDF
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

          <div className="no-print fixed bottom-4 right-4 z-40 flex flex-col gap-3 md:hidden">
             <Button size="lg" className="rounded-full shadow-lg h-14 w-14" onClick={() => setShowMobileEditor(!showMobileEditor)}>
               <Edit className="h-6 w-6" />
             </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg h-14 w-14" disabled={isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Download className="h-6 w-6" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Choose Download Format</AlertDialogTitle>
                  <AlertDialogDescription>
                    You can download your resume as a high-quality PNG image or a multi-page PDF document.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-col gap-2">
                   <Button onClick={handleDownloadPNG} className="w-full" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileImage className="mr-2 h-4 w-4" />} Download PNG
                  </Button>
                  <AlertDialogAction onClick={handleDownloadPDF} className="w-full" disabled={isProcessing}>
                     {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />} Download PDF
                  </AlertDialogAction>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
    </div>
  );
}
