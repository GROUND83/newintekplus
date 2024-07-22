import mongoose, { Document, Model, Types } from "mongoose";

export interface IResultSurvey {
  liveSurveyId: string;
  groupId: string;
  lessonActivityId: string;
  title: string;
  isDone: boolean;
  onwer: Array<{ type: mongoose.Schema.Types.ObjectId; ref: "Participant" }>;
  results: Array<{
    surveyId: string;
    point: number;
    title: string;
  }>;
}
export interface IResultSurveyDocument extends IResultSurvey, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const resultSurvey = new mongoose.Schema<IResultSurveyDocument>(
  {
    liveSurveyId: { type: String },
    groupId: { type: String },
    lessonActivityId: { type: String },
    title: { type: String },
    isDone: { type: Boolean, default: false },
    onwer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Participant" }],
    results: [
      {
        surveyId: { type: String },
        point: { type: Number },
        title: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const ResultSurvey: Model<IResultSurveyDocument> =
  mongoose.models?.ResultSurvey || mongoose.model("ResultSurvey", resultSurvey);

export default ResultSurvey;
