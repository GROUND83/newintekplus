import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface ILessonDirective {
  groupId: string;
  type: string;
  LessonDirectiveURL: string; //레슨다운로드
  contentName: string; // 자료이름
  contentSize: number; // 자료 파일 크기
  contentfileName: string; // 자료 파일네임 크기
  contentdescription: string; // 자료설명
}

export interface ILessonDirectiveDocument extends ILessonDirective, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const lessonDirective = new mongoose.Schema<ILessonDirectiveDocument>(
  {
    groupId: { type: String },
    type: {
      type: String,
      enum: ["교안", "지시문"],
      default: "교안",
    },
    LessonDirectiveURL: { type: String }, //레슨다운로드
    contentName: { type: String }, // 자료이름
    contentSize: { type: Number }, // 자료 파일 크기
    contentfileName: { type: String }, // 자료 파일 네임
    contentdescription: { type: String }, // 자료설명
    // onwer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const LessonDirective: Model<ILessonDirectiveDocument> =
  mongoose.models?.LessonDirective ||
  mongoose.model("LessonDirective", lessonDirective);

export default LessonDirective;
