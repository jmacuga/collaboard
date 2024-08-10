function SideToolbar({ setCursorMode }: { setCursorMode: any }) {
  return (
    <div className="h-screen w-32 bg-gray-800 text-white">
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        Tools
      </div>
      <nav className="mt-4">
        <ul>
          <li
            className="flex items-center p-4 hover:bg-gray-700"
            onClick={() => {
              setCursorMode("drawing");
            }}
          >
            <span>Draw</span>
          </li>
          <li
            className="flex items-center p-4 hover:bg-gray-700"
            onClick={() => {
              setCursorMode("dragging");
            }}
          >
            <span>Drag</span>
          </li>
          <li
            className="flex items-center p-4 hover:bg-gray-700"
            onClick={() => {
              setCursorMode("selecting");
            }}
          >
            <span>Select</span>
          </li>
          <li className="flex items-center p-4 hover:bg-gray-700">
            <span>Settings</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SideToolbar;
