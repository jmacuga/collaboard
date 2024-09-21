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
  users: [String];
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

export async function getRoomById(id: string): Promise<IRoom | null> {
  try {
    await dbConnect();
    const room = await Room.findById(id);
    return JSON.parse(JSON.stringify(room));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function createFabricCanvas(
  objects?: [Object?],
  layers?: [Object?]
): Promise<IFabricCanvas | null> {
  try {
    await dbConnect();
    const canvas = await FabricCanvas.create({ objects, layers });
    return JSON.parse(JSON.stringify(canvas));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getFabricCanvasById(
  id: string
): Promise<IFabricCanvas | null> {
  try {
    await dbConnect();
    const canvas = await FabricCanvas.findById(id);
    return canvas;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUser(email: string): Promise<User | null> {
  try {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
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

export async function fetchUserRooms(userId: string): Promise<IRoom[] | null> {
  try {
    await dbConnect();
    const rooms = await Room.find({ createdBy: userId });
    return JSON.parse(JSON.stringify(rooms));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function addObjectToCanvas({
  object,
  canvasId,
}: {
  object: Object;
  canvasId: string;
}) {
  try {
    await dbConnect();
    const canvas = await FabricCanvas.findById(canvasId);
    canvas.objects.push(object);
    canvas.save();
  } catch (e) {
    console.error(e);
  }
}
