import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface INotice {
  groupId: string;
  mail: boolean;
  sendTo: string;
  title: string; // 타이틀
  description: string;
  contents: Array<{
    [x: string]: any;
    type: mongoose.Schema.Types.ObjectId;
    ref: "NoticeContent";
  }>;
  studentIsRead: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "Participant";
  }>;
  teacherIsRead: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "Teacher";
  }>;
  teacher: { type: mongoose.Schema.Types.ObjectId; ref: "Teacher" };
  admin: { type: mongoose.Schema.Types.ObjectId; ref: "User" };
}

export interface INoticeDocument extends INotice, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const notice = new mongoose.Schema<INoticeDocument>(
  {
    groupId: { type: String },
    mail: { type: Boolean, default: false },
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
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const Notice: Model<INoticeDocument> =
  mongoose.models?.Notice || mongoose.model("Notice", notice);

export default Notice;
