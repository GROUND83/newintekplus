import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IWholeNotice {
  sendTo: string;
  title: string; // 타이틀
  description: string;
  contents: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "WholeNoticeContent";
  }>;
  studentIsRead: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "Participant";
  }>;
  teacherIsRead: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "Teacher";
  }>;
  admin: Array<{ type: mongoose.Schema.Types.ObjectId; ref: "User" }>;
}

export interface IWholeNoticeDocument extends IWholeNotice, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const wholeNotice = new mongoose.Schema<IWholeNoticeDocument>(
  {
    sendTo: {
      type: String,
      enum: ["all", "teacher", "student"],
      default: "all",
    },
    title: { type: String, require: true }, // 타이틀
    description: { type: String },
    contents: [{ type: mongoose.Schema.Types.ObjectId, ref: "NoticeContent" }],
    studentIsRead: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
    ],
    teacherIsRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
    admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const WholeNotice: Model<IWholeNoticeDocument> =
  mongoose.models?.WholeNotice || mongoose.model("WholeNotice", wholeNotice);

export default WholeNotice;
