import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/types/User";

type ActiveUsersListProps = {
  users: User[];
};

export const ActiveUsersList = ({ users }: ActiveUsersListProps) => {
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);

  useEffect(() => {
    // Filter out duplicates by id and sort by name
    const uniqueUsers = users.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    );
    setDisplayUsers(uniqueUsers);
  }, [users]);

  if (!displayUsers.length) return null;

  return (
    <div className="absolute top-4 right-4 z-20 bg-white/90 rounded-lg shadow-md p-2 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="mr-1">👥</span>
        Active Users ({displayUsers.length})
      </h3>
      <div className="flex flex-wrap gap-2 max-w-[300px]">
        {displayUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-1"
            title={user.name || user.email || "Anonymous"}
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                {(user.name || user.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-medium truncate max-w-[100px]">
              {user.name || user.email?.split("@")[0] || "Anonymous"}
            </span>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          </div>
        ))}
      </div>
    </div>
  );
};
