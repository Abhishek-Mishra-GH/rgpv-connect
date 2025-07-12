// Generates a helpful initial answer to a student's question.
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnswerQuestionInputSchema = z.object({
  title: z.string().describe('The title of the question.'),
  body: z.string().describe('The detailed body of the question.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('A helpful, well-formatted answer that provides initial guidance or clarification.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: { schema: AnswerQuestionInputSchema },
  output: { schema: AnswerQuestionOutputSchema },
  prompt: `You are an expert academic advisor and teaching assistant for university students. A student has asked the following question. Provide a clear, helpful, and encouraging initial answer.

Your goal is to provide immediate value. You can:
1.  Directly answer the question if it's straightforward.
2.  Suggest a path to solving the problem or breaking it down.
3.  Recommend resources (like specific concepts to google, types of tutorials to watch, or general advice).
4.  Ask clarifying questions that would help others better answer the student.

Keep the tone positive and supportive. Format your response in Markdown for readability.

Question Title: {{{title}}}

Question Body:
{{{body}}}
`,
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
