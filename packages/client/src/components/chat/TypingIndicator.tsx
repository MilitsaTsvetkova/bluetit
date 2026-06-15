const TypingIndicator = () => {
  return (
    <div className="flex self-start gap-1 px-3 py-2 bg-gray-200 rounded-xl">
      <Dot />
      <Dot className="[animation-delay:0.2s]" />
      <Dot className="[animation-delay:0.4s]" />
    </div>
  );
};

const Dot = ({ className }: { className?: string }) => (
  <div
    className={`w-2 h-2 rounded-full bg-gray-800 animate-pulse ${className}`}
  />
);

export default TypingIndicator;
