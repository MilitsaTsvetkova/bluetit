import axios from 'axios';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';

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
  const conversationId = useRef<string>(crypto.randomUUID());

  const onSubmit = async ({ prompt }: FormData) => {
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);

    reset();

    const { data } = await axios.post<ChatResponse>('/api/chat', {
      prompt,
      conversationId: conversationId.current,
    });

    setMessages((prev) => [...prev, { role: 'bot', content: data.message }]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 mb-10">
        {messages.map((message, index) => (
          <p
            key={index}
            className={`px-3 py-1 rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
          >
            {message.content}
          </p>
        ))}
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
