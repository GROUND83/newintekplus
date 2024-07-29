import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IGroup {
  name: string;
  teacher: { type: mongoose.Schema.Types.ObjectId; ref: "Teacher" };
  participants: [{ type: mongoose.Schema.Types.ObjectId; ref: "Participant" }];
  courseProfile: {
    [x: string]: any;
    modules: any;
    _id: any | string;
    type: mongoose.Schema.Types.ObjectId;
    ref: "CourseProfile";
  };
  status: string; //"개설중","개설완료"  xxx
  startDate: Date;
  endDate: Date;
  place: string; // x
  liveSurvey: {
    [x: string]: any | string;
    type: mongoose.Schema.Types.ObjectId;
    ref: "LiveSurvey";
  };
  resultSurvey: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "ResultSurvey";
    }
  ];

  lessonResults: [
    {
      [x: string]: any;
      type: mongoose.Schema.Types.ObjectId;
      ref: "LessonResult";
    }
  ];
  lessonActivitys: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "LessonActivity";
    }
  ];

  jobPosition: string; //x
  notices: [
    { type: mongoose.Schema.Types.ObjectId; ref: "Notice"; default: null }
  ];
  messages: [
    { type: mongoose.Schema.Types.ObjectId; ref: "Message"; default: null }
  ];
  // groupResults: [
  //   { type: mongoose.Schema.Types.ObjectId, ref: "GroupResult" },
  // ],
}

export interface IGroupDocument extends IGroup, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const group = new mongoose.Schema<IGroupDocument>(
  {
    name: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
    ],
    courseProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProfile",
    },
    status: { type: String, default: "개설중" }, //"개설중","개설완료"  xxx
    startDate: { type: Date },
    endDate: { type: Date },
    place: { type: String }, // x
    liveSurvey: { type: mongoose.Schema.Types.ObjectId, ref: "LiveSurvey" },
    resultSurvey: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ResultSurvey" },
    ],
    // modules: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Module",
    //   },
    // ],
    lessonResults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LessonResult",
      },
    ],
    lessonActivitys: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LessonActivity",
      },
    ],

    jobPosition: { type: String }, //x
    notices: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Notice", default: null },
    ],
    messages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    ],
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const Group: Model<IGroupDocument> =
  mongoose.models?.Group || mongoose.model("Group", group);

export default Group;
