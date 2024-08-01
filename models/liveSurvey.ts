import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface ILiveSurvey {
  lessonId: string; //new
  groupId: string; //new
  title: string;
  surveys: [{ type: mongoose.Schema.Types.ObjectId; ref: "Survey" }];
  isDone: boolean;
}

export interface ILiveSurveyDocument extends ILiveSurvey, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const liveSurvey = new mongoose.Schema<ILiveSurveyDocument>(
  {
    lessonId: { type: String }, // xx
    groupId: { type: String }, // xx
    title: { type: String },
    surveys: [{ type: mongoose.Schema.Types.ObjectId, ref: "Survey" }],
    isDone: { type: Boolean, default: false }, // x
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const LiveSurvey: Model<ILiveSurveyDocument> =
  mongoose.models?.LiveSurvey || mongoose.model("LiveSurvey", liveSurvey);

export default LiveSurvey;
