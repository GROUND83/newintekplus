import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
export interface IParticipant {
  status: number; // 0 === "이메일인증중", 1 == 인증완료 => 인증완료 링크 클릭시 1로변환
  authCode: string;
  role: string;
  phone: string;
  // department 본부
  department: string;
  // part 파트명
  part: string;
  // 직군
  jobGroup: string;
  //  부서명
  jobSubGroup: string;
  // 직위
  jobPosition: string;
  // 직책
  train: string;
  // 입사일
  entryDate: Date;
  email: string;
  password: string;
  avatarUrl: string;
  companyNumber: string;
  username: string;
  loginKeep: boolean;
  aproved: boolean;
  directCreate: boolean;
}
export interface IParticipantDocument extends IParticipant, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const participant = new mongoose.Schema<IParticipantDocument>(
  {
    status: { type: Number, default: 0 }, // 0 === "이메일인증중", 1 == 인증완료 => 인증완료 링크 클릭시 1로변환
    authCode: { type: String },
    role: {
      type: String,
      default: "participant",
      require: true,
    },
    phone: {
      type: String,
      default: "",
    },
    // department 본부
    department: {
      type: String,
    },
    // part 파트명
    part: {
      type: String,
    },
    // 직군
    jobGroup: {
      type: String,
    },
    //  부서명
    jobSubGroup: {
      type: String,
    },
    // 직위
    jobPosition: {
      type: String,
    },
    // 직책
    train: {
      type: String,
    },
    // 입사일
    entryDate: { type: Date },
    email: {
      type: String,
      require: true,
      unique: true,
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

    username: { type: String },
    createdAt: { type: Date, default: Date.now },
    loginKeep: { type: Boolean, default: false },
    aproved: { type: Boolean, default: false },
    directCreate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
// passportLocalMongoose 적용함.
participant.plugin(passportLocalMongoose, {
  usernameField: "email",
});

// Create Model & Export
const Participant: Model<IParticipantDocument> =
  mongoose.models?.Participant || mongoose.model("Participant", participant);

export default Participant;
