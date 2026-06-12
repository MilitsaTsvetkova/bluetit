import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import z from 'zod';

dotenv.config();

import { chatService } from './services/chat.service';

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!!!');
});
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

const schema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt cannot be empty')
    .max(1000, 'Prompt is too long'),
  conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
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
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
