// Summarizes a question using AI, taking the question text as input.
// Returns a short, concise summary of the question.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeQuestionInputSchema = z.object({
  question: z.string().describe('The question to summarize.'),
});
export type SummarizeQuestionInput = z.infer<typeof SummarizeQuestionInputSchema>;

const SummarizeQuestionOutputSchema = z.object({
  summary: z.string().describe('A short, concise summary of the question.'),
});
export type SummarizeQuestionOutput = z.infer<typeof SummarizeQuestionOutputSchema>;

export async function summarizeQuestion(input: SummarizeQuestionInput): Promise<SummarizeQuestionOutput> {
  return summarizeQuestionFlow(input);
}

const summarizeQuestionPrompt = ai.definePrompt({
  name: 'summarizeQuestionPrompt',
  input: {schema: SummarizeQuestionInputSchema},
  output: {schema: SummarizeQuestionOutputSchema},
  prompt: `Summarize the following question in a concise and easy-to-understand manner:\n\nQuestion: {{{question}}}`,
});

const summarizeQuestionFlow = ai.defineFlow(
  {
    name: 'summarizeQuestionFlow',
    inputSchema: SummarizeQuestionInputSchema,
    outputSchema: SummarizeQuestionOutputSchema,
  },
  async input => {
    const {output} = await summarizeQuestionPrompt(input);
    return output!;
  }
);
