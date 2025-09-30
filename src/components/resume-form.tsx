'use client';

import React, { useState } from 'react';
import type { ResumeData, Experience, Education, Skill } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { refineResumeContent } from '@/ai/flows/refine-resume-content';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, GraduationCap, Lightbulb, Loader2, PlusCircle, Sparkles, Trash2, User } from 'lucide-react';

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, setResumeData }) => {
  const { toast } = useToast();
  const [refiningStates, setRefiningStates] = useState<Record<string, boolean>>({});
  const [newSkill, setNewSkill] = useState('');

  const handleChange = (section: keyof ResumeData, index: number | null, field: string, value: string) => {
    setResumeData(prev => {
      if (index === null) {
        return { ...prev, [section]: { ...(prev[section as keyof typeof prev] as object), [field]: value } };
      }
      const newSection = [...(prev[section as 'experience' | 'education' | 'skills'] || [])];
      newSection[index] = { ...newSection[index], [field]: value };
      return { ...prev, [section]: newSection };
    });
  };

  const addItem = (section: 'experience' | 'education' | 'skills') => {
    setResumeData(prev => {
      let newItem;
      const newId = crypto.randomUUID();
      if (section === 'experience') {
        newItem = { id: newId, company: '', role: '', startDate: '', endDate: '', description: '' };
      } else if (section === 'education') {
        newItem = { id: newId, institution: '', degree: '', startDate: '', endDate: '' };
      } else {
        if (!newSkill.trim()) return prev;
        newItem = { id: newId, name: newSkill.trim() };
        setNewSkill('');
      }
      return { ...prev, [section]: [...prev[section], newItem] };
    });
  };

  const removeItem = (section: 'experience' | 'education' | 'skills', id: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id),
    }));
  };

  const handleRefine = async (experienceId: string) => {
    setRefiningStates(prev => ({...prev, [experienceId]: true}));
    try {
      const experienceIndex = resumeData.experience.findIndex(exp => exp.id === experienceId);
      if (experienceIndex === -1) throw new Error("Experience not found");
      const currentText = resumeData.experience[experienceIndex].description;

      if (!currentText.trim()) {
        toast({
          variant: 'default',
          title: 'Empty Content',
          description: 'Please write a description first before using AI refinement.',
        });
        return;
      }
      
      const result = await refineResumeContent({ resumeText: currentText });
      
      if(result.refinedText) {
        handleChange('experience', experienceIndex, 'description', result.refinedText);
        toast({
          title: 'Content Refined',
          description: 'The description has been updated with AI suggestions.',
        });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to refine content.' });
    } finally {
      setRefiningStates(prev => ({...prev, [experienceId]: false}));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Your Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['personal-info', 'experience']} className="w-full">
          <AccordionItem value="personal-info">
            <AccordionTrigger className="text-lg font-semibold"><User className="mr-2" />Personal Information</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={resumeData.personalInfo.name} onChange={e => handleChange('personalInfo', null, 'name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={resumeData.personalInfo.email} onChange={e => handleChange('personalInfo', null, 'email', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={resumeData.personalInfo.phone} onChange={e => handleChange('personalInfo', null, 'phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={resumeData.personalInfo.address} onChange={e => handleChange('personalInfo', null, 'address', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                 <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" value={resumeData.personalInfo.linkedin} onChange={e => handleChange('personalInfo', null, 'linkedin', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website/Portfolio</Label>
                  <Input id="website" value={resumeData.personalInfo.website} onChange={e => handleChange('personalInfo', null, 'website', e.target.value)} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="experience">
            <AccordionTrigger className="text-lg font-semibold"><Briefcase className="mr-2" />Work Experience</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="rounded-lg border bg-accent/50 p-4 space-y-4 relative">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`role-${exp.id}`}>Role</Label>
                      <Input id={`role-${exp.id}`} value={exp.role} onChange={e => handleChange('experience', index, 'role', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`company-${exp.id}`}>Company</Label>
                      <Input id={`company-${exp.id}`} value={exp.company} onChange={e => handleChange('experience', index, 'company', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`start-date-exp-${exp.id}`}>Start Date</Label>
                      <Input id={`start-date-exp-${exp.id}`} value={exp.startDate} onChange={e => handleChange('experience', index, 'startDate', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`end-date-exp-${exp.id}`}>End Date</Label>
                      <Input id={`end-date-exp-${exp.id}`} value={exp.endDate} onChange={e => handleChange('experience', index, 'endDate', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`description-${exp.id}`}>Description</Label>
                    <Textarea id={`description-${exp.id}`} rows={4} value={exp.description} onChange={e => handleChange('experience', index, 'description', e.target.value)} />
                    <Button variant="outline" size="sm" onClick={() => handleRefine(exp.id)} disabled={refiningStates[exp.id]}>
                      {refiningStates[exp.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      Refine with AI
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeItem('experience', exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => addItem('experience')}><PlusCircle className="mr-2 h-4 w-4" />Add Experience</Button>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="education">
            <AccordionTrigger className="text-lg font-semibold"><GraduationCap className="mr-2" />Education</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="rounded-lg border bg-accent/50 p-4 space-y-4 relative">
                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                      <Input id={`institution-${edu.id}`} value={edu.institution} onChange={e => handleChange('education', index, 'institution', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor={`degree-${edu.id}`}>Degree / Certificate</Label>
                      <Input id={`degree-${edu.id}`} value={edu.degree} onChange={e => handleChange('education', index, 'degree', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                     <div className="space-y-2">
                      <Label htmlFor={`start-date-edu-${edu.id}`}>Start Date</Label>
                      <Input id={`start-date-edu-${edu.id}`} value={edu.startDate} onChange={e => handleChange('education', index, 'startDate', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`end-date-edu-${edu.id}`}>End Date</Label>
                      <Input id={`end-date-edu-${edu.id}`} value={edu.endDate} onChange={e => handleChange('education', index, 'endDate', e.target.value)} />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeItem('education', edu.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => addItem('education')}><PlusCircle className="mr-2 h-4 w-4" />Add Education</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="skills">
            <AccordionTrigger className="text-lg font-semibold"><Lightbulb className="mr-2" />Skills</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
               <div className="flex gap-2">
                 <Input 
                   value={newSkill} 
                   onChange={(e) => setNewSkill(e.target.value)} 
                   placeholder="e.g. React"
                   onKeyDown={(e) => e.key === 'Enter' && addItem('skills')}
                 />
                 <Button onClick={() => addItem('skills')}>Add Skill</Button>
               </div>
               <div className="flex flex-wrap gap-2">
                 {resumeData.skills.map((skill) => (
                   <div key={skill.id} className="flex items-center gap-2 bg-primary/20 text-primary-foreground-darker rounded-full px-3 py-1 text-sm">
                     <span>{skill.name}</span>
                     <button onClick={() => removeItem('skills', skill.id)} className="text-destructive">
                       <Trash2 className="h-3 w-3" />
                     </button>
                   </div>
                 ))}
               </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ResumeForm;
