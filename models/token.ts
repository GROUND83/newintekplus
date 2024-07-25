import mongoose, { Document, Model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
export interface IToken {
  token: string;
  email: string;
  ttl: number;
  type: string;
}
export interface ITokenDocument extends IToken, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const token = new mongoose.Schema<ITokenDocument>(
  {
    token: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    ttl: {
      type: Number,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
// passportLocalMongoose 적용함.

// Create Model & Export
const Token: Model<ITokenDocument> =
  mongoose.models?.Token || mongoose.model("Token", token);

export default Token;
