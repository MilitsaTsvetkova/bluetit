import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
  role: 'user' | 'bot';
  content: string;
};

const ChatMessages = ({ messages }: { messages: Message[] }) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

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
    <div className="flex flex-col gap-3">
      {messages.map((message, index) => (
        <div
          onCopy={handleCopy}
          key={index}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          className={`px-3 py-1 max-w-md rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
