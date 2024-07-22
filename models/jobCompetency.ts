import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IJobCompetency {
  title: string;
  company: string;
  jobposition: string; //레슨다운로드
  group: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "JobGroup";
    }
  ]; // 자료이름
}

export interface IJobCompetencyDocument extends IJobCompetency, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const jobCompetency = new mongoose.Schema<IJobCompetencyDocument>(
  {
    title: {
      type: String,
    },
    company: {
      type: String,
    },
    jobposition: {
      type: String,
    },
    group: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobGroup",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const JobCompetency: Model<IJobCompetencyDocument> =
  mongoose.models?.JobCompetency ||
  mongoose.model("JobCompetency", jobCompetency);

export default JobCompetency;
