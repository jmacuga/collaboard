import { Home } from "lucide-react";

interface ResetPositionButtonProps {
  onClick: () => void;
}

export const ResetPositionButton = ({ onClick }: ResetPositionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-white/95 border border-gray-200 text-gray-700 p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors hover:shadow-md backdrop-blur-sm"
      title="Reset board position"
      aria-label="Reset board position"
    >
      <Home size={18} />
    </button>
  );
};
