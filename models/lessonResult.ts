import mongoose, { Document, Model, Types } from "mongoose";

export interface ILessonResult {
  groupId: string;
  courseProfieId: string;
  moduleId: string;
  lessonId: string;
  lessonActivityId: string;
  point: {
    type: number;
  };
  isLessonClose: boolean; // 어드민이나 티처가 강의 클로즈
  isLessonDone: boolean; // 참가자가 렌슨 완료 한 상태? 과제 수행이나 실시간출석 완료? 과제 수행 업로드 했을때 나 출석체크 완료 햇을때
  firstCheck: boolean;
  secondCheck: boolean;
  onwer: { type: mongoose.Schema.Types.ObjectId; ref: "Participant" };
  isPass: string;
  isEvaluationDone: boolean;
  perform: {
    downUrl: string; //레슨다운로드
    fileName: string; // 레슨파일이름
    size: number; // 레슨 파일 크기
  };
  feedBack: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "FeedBack";
  };
  liveSurvey: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "LiveSurvey";
  };
  resultSurvey: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "ResultSurvey";
  };
  resultSurveyDone: {
    type: Boolean;
  };
  certipicationUrl: string;
  // eduevaluation: {
  //   type: mongoose.Schema.Types.ObjectId;
  //   ref: "EduEvaluation";
  // };
  // abilityEvaluation: {
  //   type: mongoose.Schema.Types.ObjectId;
  //   ref: "AbilityEvaluation";
  // };
}
export interface ILessonResultDocument extends ILessonResult, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const lessonResult = new mongoose.Schema<ILessonResultDocument>(
  {
    groupId: { type: String, default: null },
    courseProfieId: {
      type: String,
      default: null,
    },
    moduleId: { type: String, default: null },
    lessonId: { type: String, default: null },
    lessonActivityId: { type: String, default: null },
    point: {
      type: Number,
      enum: [1, 2, 3, 0], // 과제수행 평가
      default: 0,
    },
    isLessonClose: { type: Boolean, default: false }, // 어드민이나 티처가 강의 클로즈
    isLessonDone: { type: Boolean, default: false }, // 참가자가 렌슨 완료 한 상태? 과제 수행이나 실시간출석 완료? 과제 수행 업로드 했을때 나 출석체크 완료 햇을때
    firstCheck: { type: Boolean, default: false },
    secondCheck: { type: Boolean, default: false },
    onwer: { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
    isPass: {
      type: String,
      enum: ["ready", "failed", "passed"], // 과제수행 평가 완료시 또는 라이브 교육 완료시
      default: "ready",
    },
    isEvaluationDone: { type: Boolean, default: false },
    perform: {
      downUrl: { type: String, default: null }, //레슨다운로드
      fileName: { type: String, default: null }, // 레슨파일이름
      size: { type: Number, default: null }, // 레슨 파일 크기
    },
    feedBack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedBack",
      default: null,
    },
    liveSurvey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LiveSurvey",
      default: null,
    },
    resultSurvey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResultSurvey",
      default: null,
    },
    resultSurveyDone: {
      type: Boolean,
      default: false,
    },
    certipicationUrl: { type: String },
    // eduevaluation: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "EduEvaluation",
    //   default: null,
    // },
    // abilityEvaluation: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "AbilityEvaluation",
    //   default: null,
    // },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const LessonResult: Model<ILessonResultDocument> =
  mongoose.models?.LessonResult || mongoose.model("LessonResult", lessonResult);

export default LessonResult;
