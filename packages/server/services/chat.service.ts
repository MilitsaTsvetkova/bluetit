import OPENAI from 'openai';
import { conversationRepository } from '../repositories/conversations.repository';

const client = new OPENAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface ChatResponse {
  message: string;
  id: string;
}

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id:
        conversationRepository.getConversationResponseId(conversationId),
    });

    conversationRepository.setConversationResponseId(
      conversationId,
      response.id
    );

    return {
      message: response.output_text,
      id: response.id,
    };
  },
};
