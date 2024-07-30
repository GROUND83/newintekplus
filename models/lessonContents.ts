import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface ILessonContent {
  groupId: string;
  type: string;
  link: string;
  lessonContentdownloadURL: string; //레슨다운로드
  lessoncontentName: string; // 자료이름
  lessonContenFileName: string; // 레슨파일이름 링크
  lessonContendescription: string; // 교육교안 설명
  lessonContentSize: number; // 레슨 파일 크기
}

export interface ILessonContentDocument extends ILessonContent, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const lessonContent = new mongoose.Schema<ILessonContentDocument>(
  {
    groupId: { type: String },
    type: { type: String },
    link: { type: String },
    lessonContentdownloadURL: { type: String }, //레슨다운로드
    lessoncontentName: { type: String }, // 자료이름 xx
    lessonContenFileName: { type: String }, // 레슨파일이름 링크
    lessonContendescription: { type: String }, // 교육교안 설명
    lessonContentSize: { type: Number }, // 레슨 파일 크기
    // onwer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const LessonContent: Model<ILessonContentDocument> =
  mongoose.models?.LessonContent ||
  mongoose.model("LessonContent", lessonContent);

export default LessonContent;
