import { Home } from "lucide-react";

interface ResetPositionButtonProps {
  onClick: () => void;
}

export const ResetPositionButton = ({ onClick }: ResetPositionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-[140px] bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-20"
      title="Reset board position"
      aria-label="Reset board position"
    >
      <Home size={20} />
    </button>
  );
};
