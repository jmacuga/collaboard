interface ToolbarContainerProps {
  children: React.ReactNode;
  position?: "left" | "right";
}

const ToolbarContainer = ({
  children,
  position = "left",
}: ToolbarContainerProps) => {
  const positionClass = position === "left" ? "left-20" : "left-36";

  return (
    <div className={`fixed top-6 ${positionClass} flex flex-col`}>
      <div className="bg-gray-200 text-bice-blue shadow-lg rounded-3xl p-1">
        <nav>
          <ul className="space-y-4 py-2">{children}</ul>
        </nav>
      </div>
    </div>
  );
};

export { ToolbarContainer };
