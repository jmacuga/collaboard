import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/types/User";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useSession } from "next-auth/react";

type ActiveUsersListProps = {
  users: User[];
};

export const ActiveUsersList = ({ users }: ActiveUsersListProps) => {
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    const uniqueUsers = users.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    );
    setDisplayUsers(uniqueUsers);
  }, [users]);

  if (!displayUsers.length) return null;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const showFullList = displayUsers.length <= 2 || isExpanded;

  const getDisplayName = (user: User) => {
    if (user.id === currentUserId) {
      return "You";
    }
    return user.name || user.email?.split("@")[0] || "Anonymous";
  };

  return (
    <div className="absolute top-4 right-4 z-20 bg-white/90 rounded-lg shadow-md p-2 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <span className="mr-1">👥</span>
          Active Users ({displayUsers.length})
        </h3>
        {displayUsers.length > 2 && (
          <button
            onClick={handleToggleExpand}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            aria-label={isExpanded ? "Collapse user list" : "Expand user list"}
            tabIndex={0}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        )}
      </div>

      {showFullList ? (
        <div className="flex flex-wrap gap-2 max-w-[300px]">
          {displayUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-1"
              title={
                user.id === currentUserId
                  ? "You"
                  : user.name || user.email || "Anonymous"
              }
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={getDisplayName(user)}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                  {user.id === currentUserId
                    ? "Y"
                    : (user.name || user.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-medium truncate max-w-[100px]">
                {getDisplayName(user)}
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </div>
          ))}
        </div>
      ) : (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div
                className="flex -space-x-2 cursor-pointer"
                tabIndex={0}
                onClick={handleToggleExpand}
              >
                {displayUsers.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className={`w-8 h-8 rounded-full ring-2 ${
                      user.id === currentUserId ? "ring-blue-300" : "ring-white"
                    }`}
                    style={{ zIndex: displayUsers.length - index }}
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={getDisplayName(user)}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full ${
                          user.id === currentUserId
                            ? "bg-blue-600"
                            : "bg-blue-500"
                        } flex items-center justify-center text-white text-xs`}
                      >
                        {user.id === currentUserId
                          ? "Y"
                          : (user.name || user.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                      </div>
                    )}
                  </div>
                ))}
                {displayUsers.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
                    +{displayUsers.length - 3}
                  </div>
                )}
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-white p-2 rounded-md shadow-md border border-gray-200 z-50 max-w-[250px]"
                sideOffset={5}
              >
                <div className="flex flex-col gap-2">
                  {displayUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={getDisplayName(user)}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : (
                        <div
                          className={`w-5 h-5 rounded-full ${
                            user.id === currentUserId
                              ? "bg-blue-600"
                              : "bg-blue-500"
                          } flex items-center justify-center text-white text-xs`}
                        >
                          {user.id === currentUserId
                            ? "Y"
                            : (user.name || user.email || "U")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs">{getDisplayName(user)}</span>
                    </div>
                  ))}
                </div>
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  );
};
