'use server';

/**
 * @fileOverview AI crop recommendation flow.
 *
 * This file defines a Genkit flow that suggests the top 3 crops suitable for a farmer's land
 * based on soil type, area, and previous crop.  It exports the flow itself,
 * the input type, and the output type.
 *
 * @file         src/ai/flows/ai-crop-recommendation.ts
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const AICropRecommendationInputSchema = z.object({
  soilType: z.string().describe('The type of soil on the land.'),
  area: z.number().describe('The area of the land in acres.'),
  previousCrop: z.string().describe('The crop that was previously grown on the land.'),
  address: z.string().optional().describe('The address of the farm land for more accurate, location-based recommendations.'),
});
export type AICropRecommendationInput = z.infer<
  typeof AICropRecommendationInputSchema
>;

// Define the output schema
const AICropRecommendationOutputSchema = z.object({
  crops: z
    .array(
      z.object({
        name: z.string().describe('The name of the recommended crop.'),
        suitabilityScore: z
          .number()
          .describe('A score indicating the suitability of the crop for the land.'),
        rationale: z
          .string()
          .describe('The reasoning behind the crop recommendation.'),
        expectedMandiProfit: z
          .string()
          .describe('The expected profit from selling the crop in the mandi, in local currency (e.g., INR).'),
      })
    )
    .describe('An array of the top 3 recommended crops.'),
});
export type AICropRecommendationOutput = z.infer<
  typeof AICropRecommendationOutputSchema
>;

// Define the prompt
const aiCropRecommendationPrompt = ai.definePrompt({
  name: 'aiCropRecommendationPrompt',
  input: {
    schema: AICropRecommendationInputSchema,
  },
  output: {
    schema: AICropRecommendationOutputSchema,
  },
  prompt: `You are an expert agricultural advisor. A farmer has provided the following information about their land:

- Soil Type: {{{soilType}}}
- Area: {{{area}}} acres
- Previous Crop: {{{previousCrop}}}
{{#if address}}
- Address: {{{address}}}
Consider local climate, environmental factors and current mandi (market) prices for this address.
{{/if}}

Based on this information, recommend the top 3 crops that are most suitable for their land. For each crop, provide a suitability score (out of 100), a brief rationale for your recommendation, and the expected profit from selling the crop in the mandi in the local currency.

Format your response as a JSON object with a 'crops' array. Each element in the array should have 'name', 'suitabilityScore', 'rationale', and 'expectedMandiProfit' fields.
`,
});

// Define the flow
const aiCropRecommendationFlow = ai.defineFlow(
  {
    name: 'aiCropRecommendationFlow',
    inputSchema: AICropRecommendationInputSchema,
    outputSchema: AICropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await aiCropRecommendationPrompt(input);
    return output!;
  }
);

/**
 * Recommends the top 3 crops suitable for a farmer's land based on soil type, area, and previous crop.
 * @param input - The input data containing soil type, area, and previous crop.
 * @returns A promise that resolves to an object containing an array of the top 3 recommended crops.
 */
export async function recommendCrops(
  input: AICropRecommendationInput
): Promise<AICropRecommendationOutput> {
  return aiCropRecommendationFlow(input);
}
