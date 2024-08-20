"use server";
import { IRoom } from "@/models/Room";
import Room from "@/models/Room";
import dbConnect from "./dbConnect";
import FabricCanvas from "@/models/FabricCanvas";
import { IFabricCanvas } from "@/models/FabricCanvas";
import type { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export async function createRoom({
  name,
  createdBy,
  createdAt,
  updatedAt,
  users,
  canvasId,
}: {
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  users: [];
  canvasId: string;
}): Promise<IRoom | null> {
  try {
    await dbConnect();
    const room = await Room.create({
      name,
      createdBy,
      createdAt,
      updatedAt,
      users,
      canvasId,
    });
    return JSON.parse(JSON.stringify(room));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function createFabricCanvas(): Promise<IFabricCanvas | null> {
  try {
    await dbConnect();
    const canvas = await FabricCanvas.create();
    return JSON.parse(JSON.stringify(canvas));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUser(email: string): Promise<User | null> {
  try {
    const prisma = new PrismaClient();
    console.log("Fetching user");
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getUserRooms(email: string): Promise<IRoom[] | null> {
  try {
    await dbConnect();
    const rooms = await Room.find({ users: email });
    return JSON.parse(JSON.stringify(rooms));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getCanvasById(id: string): Promise<IFabricCanvas | null> {
  try {
    await dbConnect();
    const canvas = await FabricCanvas.findById(id);
    return JSON.parse(JSON.stringify(canvas));
  } catch (e) {
    console.error(e);
    return null;
  }
}
