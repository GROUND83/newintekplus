import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IModule {
  groupId: string;
  title: string;
  description: string;
  totalMins: number; //레슨다운로드
  lessons: [{ type: mongoose.Schema.Types.ObjectId; ref: "Lesson" }]; // 자료이름
}

export interface IModuleDocument extends IModule, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const moduleFolder = new mongoose.Schema<IModuleDocument>(
  {
    groupId: { type: String },
    title: { type: String, require: true },
    description: { type: String, require: true },
    totalMins: { type: Number, default: 0 }, //x
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], //레슨컨텐츠 xx
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const Module: Model<IModuleDocument> =
  mongoose.models?.Module || mongoose.model("Module", moduleFolder);

export default Module;
