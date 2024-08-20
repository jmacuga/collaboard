export default function BoardCards() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Board 1</h2>
          <p className="text-gray-600">Some details about this board.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Board 2</h2>
          <p className="text-gray-600">Some details about this board.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Board 3</h2>
          <p className="text-gray-600">Some details about this board.</p>
        </div>
      </div>
    </div>
  );
}
