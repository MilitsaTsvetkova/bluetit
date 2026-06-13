import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';

const Chatbot = () => {
  return (
    <div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
      <textarea
        className="w-full border-0 focus:outline-0 resize-none"
        placeholder="Type your message here..."
        maxLength={1000}
      />
      <Button size="icon" aria-label="Submit" className="rounded-full w-9 h-9">
        <FaArrowUp />
      </Button>
    </div>
  );
};

export default Chatbot;
