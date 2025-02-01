"use server";
import { IRoom } from "@/models/Room";
import Room from "@/models/Room";
import dbConnect from "./dbConnect";
import Stage, { IStage } from "@/models/Stage";
import type { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export async function createRoom({
  name,
  createdBy,
  createdAt,
  updatedAt,
  users,
  stageId,
}: {
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  users: [String];
  stageId: string;
}): Promise<IRoom | null> {
  try {
    await dbConnect();
    const room = await Room.create({
      name,
      createdBy,
      createdAt,
      updatedAt,
      users,
      stageId,
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

export async function createStage(
  objects?: [Object?],
  layers?: [Object?]
): Promise<IStage | null> {
  try {
    await dbConnect();
    const stage = await Stage.create({ objects, layers });
    return JSON.parse(JSON.stringify(stage));
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

export async function getStageById(id: string): Promise<IStage | null> {
  try {
    await dbConnect();
    const stage = await Stage.findById(id);
    return JSON.parse(JSON.stringify(stage));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function fetchUserRooms(userId: number): Promise<IRoom[] | null> {
  try {
    await dbConnect();
    const rooms = await Room.find({ createdBy: userId });
    return JSON.parse(JSON.stringify(rooms));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function addObjectToCanvasStage({
  object,
  stageId,
}: {
  object: Object;
  stageId: string;
}) {
  try {
    await dbConnect();
    const stage = await Stage.findById(stageId);
    stage.objects.push(object);
    stage.save();
  } catch (e) {
    console.error(e);
  }
}
