import axios from 'axios';
import { useRef, useState } from 'react';
import ChatInput, { type ChatFormData } from './ChatInput';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import TypingIndicator from './TypingIndicator';

type ChatResponse = {
  message: string;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationId = useRef<string>(crypto.randomUUID());

  const onSubmit = async ({ prompt }: ChatFormData) => {
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setIsBotTyping(true);
    setError(null);

    try {
      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });

      setMessages((prev) => [...prev, { role: 'bot', content: data.message }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setError('An error occurred while fetching the response.');
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
};

export default Chatbot;
