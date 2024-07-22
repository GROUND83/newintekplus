import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface ICourseDirective {
  groupId: string;
  type: string;
  LessonDirectiveURL: string; //레슨다운로드
  contentName: string; // 자료이름
  contentSize: number; // 자료 파일 크기
  contentfileName: string; // 자료 파일네임 크기
  contentdescription: string; // 자료설명
}

export interface ICourseDirectiveDocument extends ICourseDirective, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const courseDirective = new mongoose.Schema<ICourseDirectiveDocument>(
  {
    groupId: { type: String },
    type: { type: String }, //x
    LessonDirectiveURL: { type: String, required: true }, //레슨다운로드
    contentName: { type: String }, // 자료이름 x
    contentSize: { type: Number, required: true }, // 레슨 파일 크기
    contentfileName: { type: String, required: true }, // 레슨파일이름 링크
    contentdescription: { type: String }, // 교육교안 설명 x
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const CourseDirective: Model<ICourseDirectiveDocument> =
  mongoose.models?.CourseDirective ||
  mongoose.model("CourseDirective", courseDirective);

export default CourseDirective;
