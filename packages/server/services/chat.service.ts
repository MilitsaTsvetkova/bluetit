import fs from 'fs';
import path from 'path';
import { llmClient } from '../llm/client';
import template from '../llm/prompts/chatbot.txt';
import { conversationRepository } from '../repositories/conversations.repository';

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
    const response = await llmClient.generateText({
      model: 'gpt-4o-mini',
      instructions,
      prompt,
      temperature: 0.2,
      maxTokens: 200,
      previousResponseId:
        conversationRepository.getConversationResponseId(conversationId),
    });

    conversationRepository.setConversationResponseId(
      conversationId,
      response.id
    );

    return {
      message: response.text,
      id: response.id,
    };
  },
};
