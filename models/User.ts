import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  surname: string;
  passwordHash: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    passwordHash: { type: String, required: true },
    username: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "users");
