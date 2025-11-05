'use server';

/**
 * @fileOverview Generates a description of a tourist location using generative AI based on its coordinates, landmarks,
 * and nearby infrastructure.
 *
 * - generateLocationDescription - A function that handles the generation of the location description.
 * - GenerateLocationDescriptionInput - The input type for the generateLocationDescription function.
 * - GenerateLocationDescriptionOutput - The return type for the generateLocationDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocationDescriptionInputSchema = z.object({
  coordinates: z
    .string()
    .describe('The coordinates of the tourist location (latitude, longitude).'),
  landmarks: z.string().describe('Nearby landmarks of the tourist location.'),
  infrastructure: z
    .string()
    .describe('Nearby infrastructure (e.g., restaurants, hotels, public transport).'),
});
export type GenerateLocationDescriptionInput = z.infer<
  typeof GenerateLocationDescriptionInputSchema
>;

const GenerateLocationDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the tourist location.'),
});
export type GenerateLocationDescriptionOutput = z.infer<
  typeof GenerateLocationDescriptionOutputSchema
>;

export async function generateLocationDescription(
  input: GenerateLocationDescriptionInput
): Promise<GenerateLocationDescriptionOutput> {
  return generateLocationDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLocationDescriptionPrompt',
  input: {schema: GenerateLocationDescriptionInputSchema},
  output: {schema: GenerateLocationDescriptionOutputSchema},
  prompt: `You are an expert travel writer. Generate a detailed and engaging description of a tourist location based on the following information:

Coordinates: {{{coordinates}}}
Landmarks: {{{landmarks}}}
Infrastructure: {{{infrastructure}}}

Description:`,
});

const generateLocationDescriptionFlow = ai.defineFlow(
  {
    name: 'generateLocationDescriptionFlow',
    inputSchema: GenerateLocationDescriptionInputSchema,
    outputSchema: GenerateLocationDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
