import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import LessonContent, { ILessonContent } from "./lessonContents";
import LessonDirective, { ILessonDirective } from "./lessonDirective";

export interface ICourseProfile {
  groupId: string;
  title: string; //과정명
  eduTarget: string; //교육목표
  train: string; //육성구분
  jobPosition: string; // 교육직위 array?
  eduForm: string; //교육형태
  eduPlace: string; //교육장소 //x
  jobGroup: string; // 대상직군 array?
  jobSubGroup: string; // 대상그룹
  competency: string; //역량구분 array?
  eduAbilitys: Array<{
    _id: string;
    title: string;
    type: string;
  }>; //요구역량 array?
  modules: [
    {
      [x: string]: any;
      type: mongoose.Schema.Types.ObjectId;
      ref: "Module";
    } // 과제수행결과 강사가 체크 여부 성공/실폐  점수 (셀프러닝) xx
  ];
  totalMins: number;
  //   status: string;
  //   place: string; //
  //   startDate: Date;
  //   endDate: Date;
  //   teacher: { type: mongoose.Schema.Types.ObjectId; ref: "Teacher" };
  //   participants: [{ type: mongoose.Schema.Types.ObjectId; ref: "Participant" }];
  //   coursePermition: string; //접근권한
  courseDirective: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "CourseDirective";
  };
  courseWholeDirective: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "CourseDirective";
  };
  //   groups: [{ type: mongoose.Schema.Types.ObjectId; ref: "Group" }]; ///x
}
export interface ICourseProfileDocument extends ICourseProfile, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const courseProfile = new mongoose.Schema<ICourseProfileDocument>(
  {
    groupId: { type: String },
    title: { type: String, required: true }, //과정명
    eduTarget: { type: String }, //교육목표
    train: { type: String, default: "신입/신규" }, //육성구분 x
    jobPosition: {
      type: String,
      default: "전체",
    }, // 교육직위 array?
    eduForm: { type: String, default: "집합교육" }, //교육형태
    eduPlace: { type: String, default: "사내" }, //교육장소 //x

    jobGroup: {
      type: String,
      default: "전체",
    }, // 대상직군 array?
    jobSubGroup: {
      type: String,
      default: "전체",
    }, // 대상그룹
    competency: {
      type: String,
      default: "공통 역량",
    }, //역량구분 array?
    eduAbilitys: [
      {
        _id: { type: String },
        title: { type: String },
        type: { type: String },
      },
    ], //요구역량 array?
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
    totalMins: { type: Number, default: 0 },

    courseDirective: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseDirective",
    },
    courseWholeDirective: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseDirective",
    },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const CourseProfile: Model<ICourseProfileDocument> =
  mongoose.models?.CourseProfile ||
  mongoose.model("CourseProfile", courseProfile);

export default CourseProfile;
