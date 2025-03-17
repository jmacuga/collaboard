import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useDocument, useHandle } from "@automerge/automerge-repo-react-hooks";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { useClientSync } from "../context/client-doc-context";
import { v4 as uuidv4 } from "uuid";
import {
  useLocalAwareness,
  useRemoteAwareness,
} from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { User } from "@/types/User";

export const useActiveUsers = () => {
  const clientSyncService = useClientSync();
  const docUrl = clientSyncService.getDocUrl() as AnyDocumentId;
  const [localDoc] = useDocument<LayerSchema>(docUrl);
  const handle = useHandle<LayerSchema>(docUrl);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  const { data: session } = useSession();

  const localUserId = session?.user.id ?? uuidv4();
  if (!handle) return;
  const [localAwareness, setLocalAwareness] = useLocalAwareness({
    handle,
    userId: localUserId,
    initialState: [],
  });
  const [peerStates, heartbeats] = useRemoteAwareness({
    handle,
    localUserId,
    getTime: () => Date.now(),
  });

  useEffect(() => {
    if (!peerStates) return;

    const users = Object.entries(peerStates)
      .filter(([peerId, data]) => {
        const timestamp = heartbeats[peerId];
        const hasUserData = data?.user?.id || data?.user?.email;
        const isRecent = timestamp && Date.now() - timestamp < 1000;
        return hasUserData && isRecent;
      })
      .map(([peerId, data]) => ({
        id: data.user.id || peerId,
        name: data.user.name || null,
        email: data.user.email || null,
        image: data.user.image || null,
        lastSeen: data.timestamp || Date.now(),
      }));

    if (session?.user && !users.some((user) => user.id === session.user.id)) {
      users.push({
        id: session.user.id as string,
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        lastSeen: Date.now(),
      });
    }

    setActiveUsers(users);
  }, [peerStates, session]);

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

    setLocalAwareness(currentUser);

    const interval = setInterval(() => {
      setLocalAwareness({
        ...currentUser,
        timestamp: Date.now(),
      });
    }, 5000);

    return () => {
      setLocalAwareness(null);
      clearInterval(interval);
    };
  }, [session]);

  return { activeUsers };
};
