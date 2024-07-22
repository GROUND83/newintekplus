import mongoose, { Document, Model, Types } from "mongoose";

export interface IssueRankAnswerGrade {
  groupId: string;
  value: number;
  author: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "Participant";
  };
}

export interface IssueRankAnswerGradeDocument
  extends IssueRankAnswerGrade,
    Document {
  createdAt: Date;
  updatedAt: Date;
}
const issueRankAnswerGrade = new mongoose.Schema<IssueRankAnswerGradeDocument>(
  {
    groupId: { type: String },
    value: { type: Number },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
    },
  },
  {
    timestamps: true,
  }
);

const IssueRankAnswerGrade: Model<IssueRankAnswerGradeDocument> =
  mongoose.models?.IssueRankAnswerGrade ||
  mongoose.model("IssueRankAnswerGrade", issueRankAnswerGrade);

export interface IssueRankAnswer {
  groupId: string;
  answer: string;
  checked: boolean;
  finalCheck: boolean;
  avg: number;
  grade: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "IssueRankAnswerGrade";
  }>;
  author: { type: mongoose.Schema.Types.ObjectId; ref: "Participant" };
}
export interface IssueRankAnswerDocument extends IssueRankAnswer, Document {
  createdAt: Date;
  updatedAt: Date;
}
const issueRankAnswer = new mongoose.Schema<IssueRankAnswerDocument>(
  {
    groupId: { type: String },
    answer: { type: String },
    checked: { type: Boolean },
    finalCheck: { type: Boolean, default: false },
    avg: { type: Number },
    grade: [
      { type: mongoose.Schema.Types.ObjectId, ref: "IssueRankAnswerGrade" },
    ],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
  },
  {
    timestamps: true,
  }
);

const IssueRankAnswer: Model<IssueRankAnswerDocument> =
  mongoose.models?.IssueRankAnswer ||
  mongoose.model("IssueRankAnswer", issueRankAnswer);

//
export interface IssueRank {
  groupId: string;
  activityTitle: string;
  issueTitle: string;
  answerNum: number;
  answers: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "IssueRankAnswer";
  }>;
  participants: Array<{
    type: mongoose.Schema.Types.ObjectId;
    ref: "Participant";
  }>;
  step: string;
  result: {
    avg: number;
    displayName: string;
    answer: string;
  };
}
export interface IssueRankDocument extends IssueRank, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const issueRank = new mongoose.Schema<IssueRankDocument>(
  {
    groupId: { type: String },
    activityTitle: { type: String },
    issueTitle: { type: String },
    answerNum: { type: Number },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "IssueRankAnswer" }],
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
    ],
    step: {
      type: String,
      enum: ["ready", "answer", "grade", "done"],
      default: "ready",
      require: true,
    },
    result: {
      avg: { type: Number },
      displayName: { type: String },
      answer: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const IssueRank: Model<IssueRankDocument> =
  mongoose.models?.IssueRank || mongoose.model("IssueRank", issueRank);

export default IssueRank;
