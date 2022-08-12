import mongoose from "mongoose";

export interface IVerificationToken extends mongoose.Document { 
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VERIFICATION_TOKEN_SCHEMA = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "USER",
      required: [true, "User is required"],
      unique: true,
    },
    token: {
      type: String,
      required: [true, "Token is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Please provide expiresAt"],
    },
  },
  {
    timestamps: true,
  }
);

export const verificationTokenModel = mongoose.model<IVerificationToken>(
  "VERIFICATION_TOKEN",
  VERIFICATION_TOKEN_SCHEMA
);
