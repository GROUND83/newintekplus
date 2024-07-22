import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IcompetencyDictionar {
  type: string; // 일반 , level
  title: string; //과정명
  description: string; //과정명
  subElements: Array<string>; //하위요소
  behaviorIndicator: Array<string>; //행동지표
  level1: Array<string>; //하위요소
  level2: Array<string>; //하위요소
  level3: Array<string>; //하위요소
  level4: Array<string>; //하위요소
}

export interface IcompetencyDictionaryDocument
  extends IcompetencyDictionar,
    Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const competencyDictionary = new mongoose.Schema<IcompetencyDictionaryDocument>(
  {
    type: { type: String }, // 일반 , level
    title: { type: String, required: true }, //과정명
    description: { type: String, required: true }, //과정명
    subElements: [
      {
        type: String,
      },
    ], //하위요소
    behaviorIndicator: [
      {
        type: String,
      },
    ], //행동지표
    level1: [
      {
        type: String,
      },
    ], //하위요소
    level2: [
      {
        type: String,
      },
    ], //하위요소
    level3: [
      {
        type: String,
      },
    ], //하위요소
    level4: [
      {
        type: String,
      },
    ], //하위요소
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const CompetencyDictionary: Model<IcompetencyDictionaryDocument> =
  mongoose.models?.CompetencyDictionary ||
  mongoose.model("CompetencyDictionary", competencyDictionary);

export default CompetencyDictionary;
