import mongoose, { Document, Model, Types } from "mongoose";

export interface ICommonCompetency {
  competencys: [
    { type: mongoose.Schema.Types.ObjectId; ref: "CompetencyDictionary" }
  ]; // 일반 , level
}

export interface ICommonCompetencyDocument extends ICommonCompetency, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const commonCompetency = new mongoose.Schema<ICommonCompetencyDocument>(
  {
    competencys: [
      { type: mongoose.Schema.Types.ObjectId, ref: "CompetencyDictionary" },
    ],
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
const CommonCompetency: Model<ICommonCompetencyDocument> =
  mongoose.models?.CommonCompetency ||
  mongoose.model("CommonCompetency", commonCompetency);

export default CommonCompetency;
