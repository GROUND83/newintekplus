import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface INoticeContent {
  groupId: string;
  contentdownloadURL: string; //레슨다운로드
  contentName: string; // 자료이름

  contentSize: number; // 레슨 파일 크기
}

export interface INoticeContentDocument extends INoticeContent, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const noticeContent = new mongoose.Schema<INoticeContentDocument>(
  {
    groupId: { type: String },
    contentdownloadURL: { type: String, required: true }, //레슨다운로드
    contentName: { type: String }, // 자료이름
    contentSize: { type: Number, required: true }, // 레슨 파일 크기
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const NoticeContent: Model<INoticeContentDocument> =
  mongoose.models?.NoticeContent ||
  mongoose.model("NoticeContent", noticeContent);

export default NoticeContent;
