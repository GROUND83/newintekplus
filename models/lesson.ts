import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import LessonContent, { ILessonContent } from "./lessonContents";
import LessonDirective, { ILessonDirective } from "./lessonDirective";

export interface ILesson {
  groupId: string;
  courseProfieId: string;
  moduleId: string;
  title: string; // 레슨명 *
  description: string; // 레슨개요 *
  property: string; //교육형태 S-OJT *
  liveSurvey: Types.ObjectId;
  evaluation: string; //평가방법
  lessonHour: number; // 레슨 시간
  type: string;
  copyed: boolean;
  lessonDirective: ILessonDirective; // 강의교안 또는 과제지시문
  lessonContents: Array<ILessonContent>; //학습컨텐츠
  //   students: [{ type: mongoose.Schema.Types.ObjectId; ref: "LessonStudent" }]; // 과제 출첵 피드백 평가 정보 xx
  //   participants: [{ type: mongoose.Schema.Types.ObjectId; ref: "Participant" }];
  lessonComplete: [
    { type: mongoose.Schema.Types.ObjectId; ref: "LessonComplete" } // 과제수행결과 강사가 체크 여부 성공/실폐  점수 (셀프러닝) xx
  ];
  lessonPerforms: [
    { type: mongoose.Schema.Types.ObjectId; ref: "LessonPerform" } // 과제수형괄과물  xx
  ];
  activity: [
    {
      activituId: string;
      activityType: string;
    }
  ];
  issueRank: [{ type: mongoose.Schema.Types.ObjectId; ref: "IssueRank" }];
  issueVerty: [{ type: mongoose.Schema.Types.ObjectId; ref: "IssueVerty" }];
  alternative: [{ type: mongoose.Schema.Types.ObjectId; ref: "Alternative" }];
  quiz: [{ type: mongoose.Schema.Types.ObjectId; ref: "Quiz" }];
  status: string;
  finished: string;
  page: number;
}
export interface ILessonDocument extends ILesson, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const lesson = new mongoose.Schema<ILessonDocument>(
  {
    groupId: { type: String },
    courseProfieId: { type: String },
    moduleId: { type: String },
    title: { type: String, require: true }, // 레슨명 *
    description: { type: String }, // 레슨개요 *
    property: { type: String }, //교육형태 S-OJT *
    liveSurvey: { type: mongoose.Schema.Types.ObjectId, ref: "LiveSurvey" },
    evaluation: {
      type: String,
      enum: ["학습자반응", "학업성취도", "현업적용도", "경영기여도"],
      default: "학습자반응",
    }, //평가방법
    lessonHour: { type: Number, default: 0 }, // 레슨 시간

    type: {
      type: String,
      enum: ["direct", "library"],
      default: "library",
      require: true,
    },
    copyed: { type: Boolean, default: false },
    lessonDirective: {
      type: mongoose.Schema.Types.ObjectId,
      ref: LessonDirective,
    }, // 강의교안 또는 과제지시문
    lessonContents: [
      { type: mongoose.Schema.Types.ObjectId, ref: LessonContent },
    ], //학습컨텐츠
    // students: [{ type: mongoose.Schema.Types.ObjectId, ref: "LessonStudent" }], // 과제 출첵 피드백 평가 정보 xx
    // participants: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
    // ],

    lessonComplete: [
      { type: mongoose.Schema.Types.ObjectId, ref: "LessonComplete" }, // 과제수행결과 강사가 체크 여부 성공/실폐  점수 (셀프러닝) xx
    ],

    lessonPerforms: [
      { type: mongoose.Schema.Types.ObjectId, ref: "LessonPerform" }, // 과제수형괄과물  xx
    ],

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
    issueRank: [{ type: mongoose.Schema.Types.ObjectId, ref: "IssueRank" }],
    issueVerty: [{ type: mongoose.Schema.Types.ObjectId, ref: "IssueVerty" }],
    alternative: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alternative" }],
    quiz: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
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
    },
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
const Lesson: Model<ILessonDocument> =
  mongoose.models?.Lesson || mongoose.model("Lesson", lesson);

export default Lesson;
