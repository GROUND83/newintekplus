import mongoose, { Document, Model, Types } from "mongoose";

export interface ITeacher {
  status: number; // 0 === "이메일인증중", 1 == 인증완료 => 인증완료 링크 클릭시 1로변환
  authCode: string;
  type: string;
  role: string;
  // 직군
  jobGroup: string;
  //  부서명
  jobSubGroup: string;
  // 직위
  jobPosition: string;
  // 직책
  phone: string;
  department: string;
  // department 본부
  // part 파트명
  entryDate: Date;
  email: string;
  password: string;
  avatarUrl: string;
  companyNumber: string;
  part: string;
  train: string;
  // 입사일
  username: string;
  loginKeep: boolean;

  aproved: boolean;
}
export interface ITeacherDocument extends ITeacher, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const teacher = new mongoose.Schema<ITeacherDocument>(
  {
    status: { type: Number, default: 0 }, // 0 === "이메일인증중", 1 == 인증완료 => 인증완료 링크 클릭시 1로변환
    authCode: { type: String },
    type: {
      type: String,
      enum: ["사내", "사외"],
      default: "사내",
    },
    role: {
      type: String,
      default: "teacher",
      require: true,
    },
    // 직군
    jobGroup: {
      type: String,
    },
    // 그룹
    jobSubGroup: {
      type: String,
    },
    // 직위
    jobPosition: {
      type: String,
    },
    phone: {
      type: String,
    },
    // 입사일
    department: { type: String }, //소속
    entryDate: { type: Date },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    companyNumber: {
      type: String,
    },
    part: { type: String }, //소속
    train: { type: String }, //소속
    username: { type: String },
    loginKeep: { type: Boolean, default: false },
    aproved: { type: Boolean, default: false }, //승인
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const Teacher: Model<ITeacherDocument> =
  mongoose.models?.Teacher || mongoose.model("Teacher", teacher);

export default Teacher;
