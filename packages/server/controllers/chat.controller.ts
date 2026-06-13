import type { Request, Response } from 'express';
import { z } from 'zod';
import { chatService } from '../services/chat.service';

const schema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt cannot be empty')
    .max(1000, 'Prompt is too long'),
  conversationId: z.uuid(),
});

export const chatController = {
  sendMessage: async (req: Request, res: Response) => {
    const parsedResult = schema.safeParse(req.body);
    if (!parsedResult.success) {
      return res.status(400).json({ error: parsedResult.error.format() });
    }

    try {
      const { prompt, conversationId } = parsedResult.data;
      const response = await chatService.sendMessage(prompt, conversationId);

      res.json({ result: response.message, id: response.id });
    } catch (error) {
      console.error('Error generating text:', error);
      res.status(500).json({ error: 'Failed to generate a response' });
    }
  },
};
