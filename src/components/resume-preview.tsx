'use client';

import React from 'react';
import Image from 'next/image';
import type { ResumeData } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Linkedin, Link as LinkIcon, MapPin } from 'lucide-react';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(({ resumeData }, ref) => {
  const { personalInfo, summary, experience, education, skills, template } = resumeData;

  const templateClasses: Record<ResumeData['template'], string> = {
    standard: 'template-standard',
    modern: 'template-modern',
    classic: 'template-classic',
  };

  return (
    <div ref={ref} className={`bg-white text-gray-800 p-8 shadow-lg w-full h-full aspect-[210/297] overflow-auto ${templateClasses[template]}`}>
      <header className="flex items-center mb-8 gap-6 header-section">
        {personalInfo.profilePicture && (
          <div className="relative h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={personalInfo.profilePicture}
              alt={personalInfo.name}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint="profile person"
            />
          </div>
        )}
        <div className="flex-grow">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-gray-900 name">{personalInfo.name || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-2 contact-info">
            {personalInfo.email && <div className="flex items-center gap-1"><Mail size={14} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-1"><Phone size={14} /><span>{personalInfo.phone}</span></div>}
            {personalInfo.address && <div className="flex items-center gap-1"><MapPin size={14} /><span>{personalInfo.address}</span></div>}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1 links">
            {personalInfo.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-primary/90"><Linkedin size={14} /><span>LinkedIn</span></a>}
            {personalInfo.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-primary/90"><LinkIcon size={14} /><span>Portfolio</span></a>}
          </div>
        </div>
      </header>

      <section>
        <h2 className="font-headline text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 section-title">Summary</h2>
        <p className="text-sm text-gray-600">{summary || 'A brief professional summary.'}</p>
      </section>

      <Separator className="my-6" />

      <section>
        <h2 className="font-headline text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 section-title">Experience</h2>
        <div className="space-y-6">
          {experience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold item-title">{exp.role || 'Role'}</h3>
                <div className="text-sm text-gray-600 date-range">{exp.startDate} - {exp.endDate}</div>
              </div>
              <h4 className="text-md font-semibold text-gray-700 sub-title">{exp.company || 'Company'}</h4>
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{exp.description || 'Description of responsibilities and achievements.'}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-6" />

      <section>
        <h2 className="font-headline text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 section-title">Education</h2>
        <div className="space-y-4">
          {education.map(edu => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold item-title">{edu.institution || 'Institution'}</h3>
                <div className="text-sm text-gray-600 date-range">{edu.startDate} - {edu.endDate}</div>
              </div>
              <p className="text-md text-gray-700 sub-title">{edu.degree || 'Degree or Certificate'}</p>
            </div>
          ))}
        </div>
      </section>
      
      <Separator className="my-6" />

      <section>
        <h2 className="font-headline text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 section-title">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill.id} className="bg-accent text-accent-foreground rounded-md px-3 py-1 text-sm font-medium skill-item">
              {skill.name || 'Skill'}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
