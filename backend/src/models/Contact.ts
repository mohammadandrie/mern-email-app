import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  email: string;
  date: Date;
  description: string;
  emailSent: boolean;
  emailSentAt: Date | null;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IContact>("Contact", contactSchema);
