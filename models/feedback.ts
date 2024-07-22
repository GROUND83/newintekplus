import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IFeedBack {
  groupId: string;
  title: string; // 레슨명
  description: string;
  lessonResultId: string;
  contentdownloadURL: string; //레슨다운로드
  contenFileName: string; // 레슨파일이름 링크
  contentSize: number; // 레슨 파일 크기
  participants: { type: mongoose.Schema.Types.ObjectId; ref: "Participant" };
  auth: { type: mongoose.Schema.Types.ObjectId; ref: "Teacher" };
  isRead: boolean;
  isSend: boolean;
  teacherIsRead: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "Teacher";
  }>;
  adminIsRead: Array<{ type: mongoose.Schema.Types.ObjectId; ref: "User" }>;
}

export interface IFeedBackDocument extends IFeedBack, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const feedBack = new mongoose.Schema<IFeedBackDocument>(
  {
    groupId: { type: String },
    title: { type: String, require: true }, // 레슨명
    description: { type: String },
    lessonResultId: { type: String },
    contentdownloadURL: { type: String }, //레슨다운로드
    contenFileName: { type: String }, // 레슨파일이름 링크
    contentSize: { type: Number }, // 레슨 파일 크기
    participants: { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
    auth: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    isRead: { type: Boolean, default: false },
    isSend: { type: Boolean, default: false },
    teacherIsRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
    adminIsRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const FeedBack: Model<IFeedBackDocument> =
  mongoose.models?.FeedBack || mongoose.model("FeedBack", feedBack);

export default FeedBack;
