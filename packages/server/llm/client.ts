import OPENAI from 'openai';

const client = new OPENAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type GenerateTextOptions = {
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  instructions?: string;
  previousResponseId?: string;
};

export const llmClient = {
  async generateText({
    model = 'gpt-4o-mini',
    prompt,
    temperature = 0.2,
    maxTokens = 300,
    instructions,
    previousResponseId,
  }: GenerateTextOptions): Promise<{ text: string; id: string }> {
    const response = await client.responses.create({
      model,
      input: prompt,
      temperature,
      max_output_tokens: maxTokens,
      instructions,
      previous_response_id: previousResponseId,
    });

    return { text: response.output_text, id: response.id };
  },
};
