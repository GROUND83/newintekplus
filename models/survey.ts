import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface ISurvey {
  courseProfileId: string;
  groupId: string;
  lessonId: string;
  title: string;
  point: number;
}

export interface ISurveyDocument extends ISurvey, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const survey = new mongoose.Schema<ISurveyDocument>(
  {
    courseProfileId: { type: String },
    groupId: { type: String },
    lessonId: { type: String },
    title: { type: String },
    point: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const Survey: Model<ISurveyDocument> =
  mongoose.models?.Survey || mongoose.model("Survey", survey);

export default Survey;
