import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IJobProfile {
  jobProfileName: string;
  downLoadUrl: string;
  fileName: string;
  jobProfileDescription: string;
  competencys: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "CompetencyDictionary";
    }
  ];
  knowledges: [
    {
      title: string;
      importance: number;
      difficulty: number;
    }
  ];
  skills: [
    {
      title: string;
      importance: number;
      difficulty: number;
    }
  ];
}

export interface IJobProfileDocument extends IJobProfile, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const jobProfile = new mongoose.Schema<IJobProfileDocument>(
  {
    jobProfileName: { type: String },
    downLoadUrl: { type: String },
    fileName: { type: String },
    jobProfileDescription: { type: String },
    competencys: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompetencyDictionary",
      },
    ],
    knowledges: [
      {
        title: { type: String },
        importance: { type: Number },
        difficulty: { type: Number },
      },
    ],
    skills: [
      {
        title: { type: String },
        importance: { type: Number },
        difficulty: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const JobProfile: Model<IJobProfileDocument> =
  mongoose.models?.JobProfile || mongoose.model("JobProfile", jobProfile);

export default JobProfile;
