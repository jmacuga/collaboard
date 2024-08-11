import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/lib/models";

export async function fetchAllUsers() {
  try {
    const client = await clientPromise;
    const db = client.db("collaboard");
    const users = await db.collection("users").find({}).toArray();
    return users;
  } catch (e) {
    console.error(e);
  }
}
