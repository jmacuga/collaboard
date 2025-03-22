interface UserStatusPayload {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  timestamp: number;
  editingObjects: string[];
  color: string;
}

export { UserStatusPayload };
