interface ToolbarContainerProps {
  children: React.ReactNode;
}

const ToolbarContainer = ({ children }: ToolbarContainerProps) => {
  return (
    <div className="bg-gray-200 text-bice-blue shadow-lg rounded-3xl p-1">
      <nav>
        <ul className="space-y-4 py-2">{children}</ul>
      </nav>
    </div>
  );
};

export { ToolbarContainer };
