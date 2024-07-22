import mongoose, { Document, Model, Types } from "mongoose";

export interface IActivity {
  groupId: string;
  courseProfieId: string;
  moduleId: string;
  lessonId: string;
  title: string;
  isAsync: boolean; //동기비동기
  // 참가자

  activity: Array<{
    activituId: string;
    activityType: string;
  }>;

  issueRank: Array<{ type: mongoose.Schema.Types.ObjectId; ref: "IssueRank" }>;

  issueVerty: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "IssueVerty";
  }>;

  alternative: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "Alternative";
    default: null;
  }>;

  quiz: Array<{ type: mongoose.Schema.Types.ObjectId; ref: "Quiz" }>;
  status: string;
  finished: string; // 강의 종료상테
  page: number;
}
export interface ILessonActivityDocument extends IActivity, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const lessonActivity = new mongoose.Schema<ILessonActivityDocument>(
  {
    groupId: { type: String },
    courseProfieId: {
      type: String,
    },
    moduleId: { type: String },
    lessonId: { type: String },
    title: { type: String, default: "" },
    isAsync: { type: Boolean, default: true }, //동기비동기
    activity: [
      {
        activituId: {
          type: String,
        },
        activityType: {
          type: String,
        },
      },
    ],
    issueRank: [
      { type: mongoose.Schema.Types.ObjectId, ref: "IssueRank", default: null },
    ],
    issueVerty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IssueVerty",
        default: null,
      },
    ],
    alternative: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alternative",
        default: null,
      },
    ],
    quiz: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", default: null },
    ],
    status: {
      type: String,
      enum: [
        "ready",
        "start",
        "active_issueRank",
        "active_issueVerty",
        "active_alternative",
        "active_quiz",
        "done",
      ],
      default: "ready",
      require: true,
    },
    finished: {
      type: String,
      enum: ["ready", "start", "done"],
      default: "ready",
      require: true,
    }, // 강의 종료상테
    page: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const LessonActivity: Model<ILessonActivityDocument> =
  mongoose.models?.LessonActivity ||
  mongoose.model("LessonActivity", lessonActivity);

export default LessonActivity;
