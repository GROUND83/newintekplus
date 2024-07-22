import mongoose, { Document, Model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IReadershipCompetency {
  competencys: [
    { type: mongoose.Schema.Types.ObjectId; ref: "CompetencyDictionary" }
  ]; // 일반 , level
}

export interface IReadershipCompetencyDocument
  extends IReadershipCompetency,
    Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const readershipCompetency = new mongoose.Schema<IReadershipCompetencyDocument>(
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
const ReadershipCompetency: Model<IReadershipCompetencyDocument> =
  mongoose.models?.ReadershipCompetency ||
  mongoose.model("ReadershipCompetency", readershipCompetency);

export default ReadershipCompetency;
