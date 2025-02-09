export const boardColors = [
  {
    primary: "#FF6B6B", // Coral Red
    secondary: "#FFE66D", // Soft Yellow
  },
  {
    primary: "#4ECDC4", // Turquoise
    secondary: "#45B7D1", // Sky Blue
  },
  {
    primary: "#96CEB4", // Sage Green
    secondary: "#FFEEAD", // Cream
  },
  {
    primary: "#9B5DE5", // Purple
    secondary: "#F15BB5", // Pink
  },
  {
    primary: "#00BBF9", // Bright Blue
    secondary: "#00F5D4", // Mint
  },
  {
    primary: "#FD6E6A", // Salmon
    secondary: "#FFC145", // Golden Yellow
  },
] as const;

export const getColorForIndex = (index: number) => {
  return boardColors[index % boardColors.length];
};
