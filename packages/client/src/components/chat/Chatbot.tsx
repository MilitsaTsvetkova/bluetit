import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Button } from '../ui/button';
import TypingIndicator from './TypingIndicator';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  role: 'user' | 'bot';
  content: string;
};

const Chatbot = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormData>({
    defaultValues: {
      prompt: '',
    },
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationId = useRef<string>(crypto.randomUUID());
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const onSubmit = async ({ prompt }: FormData) => {
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setIsBotTyping(true);
    setError(null);

    reset({ prompt: '' });

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

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleCopy = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            onCopy={handleCopy}
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`px-3 py-1 rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (value) => value.trim() !== '',
          })}
          autoFocus
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Type your message here..."
          maxLength={1000}
        />
        <Button
          disabled={!formState.isValid}
          size="icon"
          aria-label="Submit"
          className="rounded-full w-9 h-9"
        >
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default Chatbot;
