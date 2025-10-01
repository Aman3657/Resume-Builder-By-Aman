// src/ai/flows/generate-summary.ts
'use server';

/**
 * @fileOverview An AI tool that generates a professional summary for a resume.
 *
 * - generateSummary - A function that accepts work experience and skills and returns a professional summary.
 * - GenerateSummaryInput - The input type for the generateSummary function.
 * - GenerateSummaryOutput - The return type for the generateSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Experience, Skill } from '@/lib/types';

const ExperienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  description: z.string(),
});

const SkillSchema = z.object({
  name: z.string(),
});

const GenerateSummaryInputSchema = z.object({
  experience: z.array(ExperienceSchema).describe('The user\'s work experience.'),
  skills: z.array(SkillSchema).describe('The user\'s skills.'),
});
export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

const GenerateSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A professional summary generated for the resume.'),
});
export type GenerateSummaryOutput = z.infer<typeof GenerateSummaryOutputSchema>;


export async function generateSummary(input: { experience: Experience[], skills: Skill[] }): Promise<GenerateSummaryOutput> {
  const flowInput = {
    experience: input.experience.map(e => ({ role: e.role, company: e.company, description: e.description })),
    skills: input.skills.map(s => ({ name: s.name }))
  };
  return generateSummaryFlow(flowInput);
}

const generateSummaryPrompt = ai.definePrompt({
  name: 'generateSummaryPrompt',
  input: {schema: GenerateSummaryInputSchema},
  output: {schema: GenerateSummaryOutputSchema},
  prompt: `You are a professional resume writer. Based on the following work experience and skills, write a compelling and concise professional summary for a resume. The summary should be 2-3 sentences long and highlight the candidate's key qualifications and strengths.

Work Experience:
{{#each experience}}
- Role: {{role}} at {{company}}
  Description: {{description}}
{{/each}}

Skills:
{{#each skills}}
- {{name}}
{{/each}}
`,
});


const generateSummaryFlow = ai.defineFlow(
  {
    name: 'generateSummaryFlow',
    inputSchema: GenerateSummaryInputSchema,
    outputSchema: GenerateSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateSummaryPrompt(input);
    return output!;
  }
);
