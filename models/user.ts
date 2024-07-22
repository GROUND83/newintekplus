import mongoose, { Document, Model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
export interface IUser {
  role: string;
  perMit: number;
  type: string;
  position: string;
  email: string;
  password: string;
  avatarUrl: string;
  displayName: string;
  snsId: string;
  provider: string;
  username: string;
  loginKeep: boolean;
}
export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}
// Define Schemes
// admin
const user = new mongoose.Schema<IUserDocument>(
  {
    role: {
      type: String,
      enum: ["admin", "superAdmin"],
      default: "admin",
      require: true,
    },
    perMit: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ["company", "pesonal", "admin"],
      default: "company",
      require: true,
    },
    position: {
      type: String,
      enum: ["1", "2", "3"],
      default: "1",
    },
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
    displayName: {
      type: String,
    },
    snsId: {
      type: String,
    },
    provider: {
      type: String,
    },
    username: { type: String },
    loginKeep: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
// passportLocalMongoose 적용함.
user.plugin(passportLocalMongoose, {
  usernameField: "email",
});

// Create Model & Export
const User: Model<IUserDocument> =
  mongoose.models?.User || mongoose.model("User", user);

export default User;
