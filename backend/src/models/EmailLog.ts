import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailLog extends Document {
  to: string;
  subject: string;
  body: string;
  sentBy: mongoose.Types.ObjectId;
  status: 'sent' | 'failed';
  sentAt: Date;
}

const emailLogSchema = new Schema<IEmailLog>(
  {
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const EmailLog = mongoose.model<IEmailLog>('EmailLog', emailLogSchema);
export default EmailLog;
