import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface ILessonPerform {
  courseProfileId: string;
  groupId: string;
  moduleId: string;
  lessonId: string;
  lessonActivityId: string;
  lessonResultId: string;
  lessonPerformdownloadURL: string; //레슨다운로드
  lessonPerformFileName: string; // 레슨파일이름
  lessonPerformSize: number; // 레슨 파일 크기
  onwer: { type: mongoose.Schema.Types.ObjectId; ref: "Participant" };
  isPassed: boolean;
  isRead: boolean;
  isEvaluationDone: boolean; // is pass
}
export interface ILessonPerformDocument extends ILessonPerform, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const lessonPerform = new mongoose.Schema<ILessonPerformDocument>(
  {
    courseProfileId: { type: String },
    groupId: { type: String },
    moduleId: { type: String },
    lessonId: { type: String },
    lessonActivityId: { type: String },
    lessonResultId: { type: String },
    lessonPerformdownloadURL: { type: String, required: true }, //레슨다운로드
    lessonPerformFileName: { type: String, required: true }, // 레슨파일이름
    lessonPerformSize: { type: Number, required: true }, // 레슨 파일 크기
    onwer: { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
    isPassed: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    isEvaluationDone: { type: Boolean, default: false }, // is pass
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const LessonPerform: Model<ILessonPerformDocument> =
  mongoose.models?.LessonPerform ||
  mongoose.model("LessonPerform", lessonPerform);

export default LessonPerform;
