import fs from 'fs';
import OPENAI from 'openai';
import path from 'path';
import template from '../llm/prompts/chatbot.txt';
import { conversationRepository } from '../repositories/conversations.repository';

const client = new OPENAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const parkInfo = fs.readFileSync(
  path.join(__dirname, '..', 'llm', 'prompts', 'WonderWorld.md'),
  'utf-8'
);

const instructions = template.replace('{{parkInfo}}', parkInfo);
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
      instructions,
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 200,
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
