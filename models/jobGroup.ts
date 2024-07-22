import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IJobGroup {
  groupName: string;
  jobprofile: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "JobProfile";
    }
  ]; // 자료이름
}

export interface IJobGroupDocument extends IJobGroup, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const jobGroup = new mongoose.Schema<IJobGroupDocument>(
  {
    groupName: { type: String },
    jobprofile: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobProfile",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const JobGroup: Model<IJobGroupDocument> =
  mongoose.models?.JobGroup || mongoose.model("JobGroup", jobGroup);

export default JobGroup;
