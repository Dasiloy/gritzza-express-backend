import mongoose from "mongoose";

export interface IPasswordResetToken
  extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RESET_PASSWORD_TOKEN_SCHEMA = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: [true, "User is required"],
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

export const resetPasswordTokenModel = mongoose.model<IPasswordResetToken>(
  "RESET_PASSWORD_TOKEN",
  RESET_PASSWORD_TOKEN_SCHEMA
);
