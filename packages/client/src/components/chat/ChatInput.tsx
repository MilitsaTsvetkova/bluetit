import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';

export type ChatFormData = {
  prompt: string;
};

const ChatInput = ({
  onSubmit,
}: {
  onSubmit: (data: ChatFormData) => void;
}) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>({
    defaultValues: {
      prompt: '',
    },
  });
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };
  const handleFormSubmit = handleSubmit((data) => {
    reset({ prompt: '' });
    onSubmit(data);
  });

  return (
    <form
      onSubmit={handleFormSubmit}
      onKeyDown={handleKeyDown}
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
  );
};

export default ChatInput;
