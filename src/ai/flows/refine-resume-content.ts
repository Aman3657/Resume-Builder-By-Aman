// src/ai/flows/refine-resume-content.ts
'use server';

/**
 * @fileOverview An AI tool that provides suggestions to improve and rephrase resume bullet points for clarity and impact.
 *
 * - refineResumeContent - A function that accepts resume text and returns suggestions for improvement.
 * - RefineResumeContentInput - The input type for the refineResumeContent function.
 * - RefineResumeContentOutput - The return type for the refineResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineResumeContentInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of a resume section to be refined.'),
});
export type RefineResumeContentInput = z.infer<typeof RefineResumeContentInputSchema>;

const RefineResumeContentOutputSchema = z.object({
  refinedText: z
    .string()
    .describe('Suggested improvements and rephrased content for the resume section.'),
});
export type RefineResumeContentOutput = z.infer<typeof RefineResumeContentOutputSchema>;

export async function refineResumeContent(input: RefineResumeContentInput): Promise<RefineResumeContentOutput> {
  return refineResumeContentFlow(input);
}

const refineResumeContentPrompt = ai.definePrompt({
  name: 'refineResumeContentPrompt',
  input: {schema: RefineResumeContentInputSchema},
  output: {schema: RefineResumeContentOutputSchema},
  prompt: `You are an expert resume writer. Review the following resume text and provide suggestions to improve the clarity and impact of the language.

Resume Text:
{{{resumeText}}}

Provide a refined version of the text with stronger action verbs and clear descriptions of accomplishments. Focus on making each point as compelling as possible, and rephrase as necessary.
`,
});

const refineResumeContentFlow = ai.defineFlow(
  {
    name: 'refineResumeContentFlow',
    inputSchema: RefineResumeContentInputSchema,
    outputSchema: RefineResumeContentOutputSchema,
  },
  async input => {
    const {output} = await refineResumeContentPrompt(input);
    return output!;
  }
);
