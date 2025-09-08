'use server';

/**
 * @fileOverview A crop disease detection AI agent.
 *
 * - detectDisease - A function that handles the disease detection process.
 * - DetectDiseaseInput - The input type for the detectDisease function.
 * - DetectDiseaseOutput - The return type for the detectDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  symptoms: z.string().describe('The symptoms observed in the crop.'),
});
export type DetectDiseaseInput = z.infer<typeof DetectDiseaseInputSchema>;

const DetectDiseaseOutputSchema = z.object({
  potentialCauses: z.string().describe('Potential causes of the disease.'),
  suggestedSolutions: z.string().describe('Suggested solutions for the disease.'),
});
export type DetectDiseaseOutput = z.infer<typeof DetectDiseaseOutputSchema>;

export async function detectDisease(input: DetectDiseaseInput): Promise<DetectDiseaseOutput> {
  return detectDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectDiseasePrompt',
  input: {schema: DetectDiseaseInputSchema},
  output: {schema: DetectDiseaseOutputSchema},
  prompt: `You are an expert in plant pathology. A farmer has provided you with a photo of their crop and a description of the symptoms they are observing.

Analyze the image and symptoms to suggest potential causes and solutions for the disease.

Symptoms: {{{symptoms}}}
Photo: {{media url=photoDataUri}}

Potential Causes:
Suggested Solutions: `,
});

const detectDiseaseFlow = ai.defineFlow(
  {
    name: 'detectDiseaseFlow',
    inputSchema: DetectDiseaseInputSchema,
    outputSchema: DetectDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
