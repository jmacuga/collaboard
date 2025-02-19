import ColorIcon from "../color-icon";

export const colorTools = [
  { label: "White", className: "bg-white", color: "rgb(255,255,255)" },
  { label: "Black", className: "bg-black", color: "rgb(0,0,0)" },
  { label: "Purple", className: "bg-purple-500", color: "rgb(128,0,128)" },
  { label: "Pink", className: "bg-pink-500", color: "rgb(255,192,203)" },
  { label: "Red", className: "bg-red-500", color: "rgb(255,0,0)" },
  { label: "Orange", className: "bg-orange-400", color: "rgb(255,165,0)" },
  { label: "Yellow", className: "bg-yellow-400", color: "rgb(255,255,0)" },
  { label: "Green", className: "bg-green-500", color: "rgb(0,128,0)" },
  { label: "Blue", className: "bg-blue-400", color: "rgb(0,0,255)" },
];

interface ColorPaletteProps {
  isOpen: boolean;
  onColorSelect: (color: string) => void;
}

const ColorPalette = ({ isOpen, onColorSelect }: ColorPaletteProps) => {
  return (
    <div
      className={`mt-2 bg-gray-200 text-bice-blue shadow-lg rounded-3xl p-1 transition-all duration-300 transform origin-top ${
        isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 h-0"
      }`}
    >
      <nav>
        <ul className="space-y-4 py-2">
          {colorTools.map((color, index) => (
            <li
              key={index}
              className="flex flex-col items-center px-1 cursor-pointer rounded-xl transition-all transform hover:scale-110"
              title={color.label}
            >
              <div
                onClick={() => onColorSelect(color.color)}
                className="text-2xl"
              >
                <ColorIcon className={color.className} />
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export { ColorPalette };
