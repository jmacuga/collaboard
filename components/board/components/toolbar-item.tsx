interface ToolbarItemProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

const ToolbarItem = ({
  label,
  icon,
  onClick,
  isActive = false,
}: ToolbarItemProps) => {
  return (
    <li
      className={`flex flex-col items-center px-1 cursor-pointer rounded-xl transition-all transform hover:scale-110
        ${isActive ? "bg-gray-300" : ""}`}
      title={label}
    >
      <div onClick={onClick} className="text-2xl">
        {icon}
      </div>
    </li>
  );
};

export { ToolbarItem };
