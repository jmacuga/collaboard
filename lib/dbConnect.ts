import mongoose from "mongoose";

declare global {
  var mongoose:
    | {
        conn: null | typeof mongoose;
        promise: null | Promise<typeof mongoose>;
      }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI ?? "";

async function dbConnect() {
  let cached = global.mongoose;

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (!MONGODB_URI) {
    throw new Error("Define the MONGODB_URI environmental variable");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
