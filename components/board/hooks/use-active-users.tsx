import { useSession } from "next-auth/react";
import { useState, useEffect, useContext, useRef } from "react";
import { useHandle } from "@automerge/automerge-repo-react-hooks";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { useClientSync } from "../context/client-sync-context";
import { v4 as uuidv4 } from "uuid";
import {
  useLocalAwareness,
  useRemoteAwareness,
} from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { User } from "@/types/User";
import { BoardContext } from "../context/board-context";
import { UserStatusPayload } from "@/types/userStatusPayload";

export type ActiveUser = User & {
  editingObjects?: string[];
  color?: string;
};

const getRandomColor = () => {
  const colors = [
    "#F44336", // Red
    "#3F51B5", // Indigo
    "#4CAF50", // Green
    "#FFC107", // Amber
    "#9C27B0", // Purple
    "#00BCD4", // Cyan
    "#FF9800", // Orange
    "#795548", // Brown
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useActiveUsers = () => {
  const clientSyncService = useClientSync();
  const docId = clientSyncService.getDocId() as AnyDocumentId;
  const handle = useHandle<LayerSchema>(docId);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const { isRealTime, selectedShapeIds } = useContext(BoardContext);
  const { data: session } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [userColor] = useState(getRandomColor());

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
    if (!session?.user || !isRealTime) return;

    const currentUser: UserStatusPayload = {
      user: {
        id: session.user.id as string,
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
      },
      timestamp: Date.now(),
      editingObjects: selectedShapeIds,
      color: userColor,
    };

    try {
      setLocalAwareness(currentUser);
    } catch (error) {
      console.error("Error setting local awareness", error);
    }
  }, [session, isRealTime, selectedShapeIds, userColor]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isRealTime && session?.user) {
      intervalRef.current = setInterval(() => {
        setUpdateTrigger((prev) => prev + 1);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRealTime, session]);

  useEffect(() => {
    if (!session?.user) return;

    const users: ActiveUser[] = [];

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
          editingObjects: data.editingObjects || [],
          color: data.color || getRandomColor(),
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
        editingObjects: selectedShapeIds,
        color: userColor,
      });
    }

    setActiveUsers(users);
  }, [
    peerStates,
    heartbeats,
    session,
    updateTrigger,
    selectedShapeIds,
    userColor,
  ]);

  useEffect(() => {
    if (!session?.user) return;
    const currentUser: UserStatusPayload = {
      user: {
        id: session.user.id as string,
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
      },
      timestamp: Date.now(),
      editingObjects: selectedShapeIds,
      color: userColor,
    };

    if (isRealTime) {
      try {
        setLocalUserId(session.user.id as string);
        setLocalAwareness(currentUser);
      } catch (error) {
        console.error("Error setting local awareness", error);
      }
    }
    if (!isRealTime) {
      console.log("Setting local user id to empty string");
      setLocalUserId("");
    }
  }, [session, isRealTime]);

  useEffect(() => {
    return () => {
      try {
        setLocalAwareness(null);
      } catch (error) {
        console.error("Error setting local awareness", error);
      }
    };
  }, []);

  const getObjectEditors = () => {
    const objectEditors: Record<string, ActiveUser[]> = {};

    activeUsers.forEach((user) => {
      if (user.editingObjects && user.editingObjects.length > 0) {
        user.editingObjects.forEach((objectId) => {
          if (!objectEditors[objectId]) {
            objectEditors[objectId] = [];
          }
          if (user.id !== session?.user?.id) {
            objectEditors[objectId].push(user);
          }
        });
      }
    });

    return objectEditors;
  };

  const objectEditors = getObjectEditors();

  return { activeUsers, objectEditors };
};
