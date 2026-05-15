import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  lastLoginAt: Date | null;
  lastLogoutAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    lastLoginAt: { type: Date, default: null },
    lastLogoutAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
