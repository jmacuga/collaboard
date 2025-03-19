import { useSession } from "next-auth/react";
import { useState, useEffect, useContext, useRef } from "react";
import { useHandle } from "@automerge/automerge-repo-react-hooks";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { useClientSync } from "../context/client-doc-context";
import { v4 as uuidv4 } from "uuid";
import {
  useLocalAwareness,
  useRemoteAwareness,
} from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { User } from "@/types/User";
import { BoardContext } from "../context/board-context";

export const useActiveUsers = () => {
  const clientSyncService = useClientSync();
  const docUrl = clientSyncService.getDocUrl() as AnyDocumentId;
  const handle = useHandle<LayerSchema>(docUrl);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const { isOnline } = useContext(BoardContext);
  const { data: session } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const [localUserId, setLocalUserId] = useState(session?.user.id ?? uuidv4());

  if (!handle) return { activeUsers: [] };

  const [localAwareness, setLocalAwareness] = useLocalAwareness({
    handle,
    userId: localUserId,
    initialState: [],
    heartbeatTime: 1000,
  });
  const [peerStates, heartbeats] = useRemoteAwareness({
    handle,
    localUserId,
    offlineTimeout: 2000,
    getTime: () => Date.now(),
  });

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isOnline && session?.user) {
      intervalRef.current = setInterval(() => {
        setUpdateTrigger((prev) => prev + 1);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOnline, session]);

  useEffect(() => {
    if (!session?.user) return;

    const users: User[] = [];

    if (peerStates) {
      const peerUsers = Object.entries(peerStates)
        .filter(([peerId, data]) => {
          const timestamp = heartbeats[peerId];
          const isRecent = timestamp && Date.now() - timestamp < 1000;
          const hasUserData = data?.user?.id || data?.user?.email;
          return hasUserData && isRecent;
        })
        .map(([peerId, data]) => ({
          id: data.user.id || peerId,
          name: data.user.name || null,
          email: data.user.email || null,
          image: data.user.image || null,
          lastSeen: data.timestamp || Date.now(),
        }));

      users.push(...peerUsers);
    }

    if (!users.some((user) => user.id === session.user.id)) {
      users.push({
        id: session.user.id as string,
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        lastSeen: Date.now(),
      });
    }

    setActiveUsers(users);
  }, [peerStates, heartbeats, session, updateTrigger]);

  useEffect(() => {
    if (!session?.user) return;
    const currentUser = {
      user: {
        id: session.user.id as string,
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
      },
      timestamp: Date.now(),
      cursor: { x: 0, y: 0 },
    };

    if (isOnline) {
      try {
        setLocalUserId(session.user.id as string);
        setLocalAwareness(currentUser);
      } catch (error) {
        console.error("Error setting local awareness", error);
      }
    }
    if (!isOnline) {
      setLocalUserId("");
    }
  }, [session, isOnline]);

  useEffect(() => {
    return () => {
      try {
        setLocalAwareness(null);
      } catch (error) {
        console.error("Error setting local awareness", error);
      }
    };
  }, []);

  return { activeUsers };
};
