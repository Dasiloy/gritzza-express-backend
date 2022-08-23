import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export enum UserRole {
  MERCHANT = "merchant",
  ADMIN = "admin",
  USER = "customer",
  AGENT = "agent",
}

export interface IUser extends mongoose.Document {
  email: string;
  role: UserRole;
  active: boolean;
  verified: boolean;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserOrNull = IUser | null;

const USER_SCHEMA = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      minlength: [
        4,
        "username should be at least 4 characters",
      ],
      maxlength: [20, "username "],
      required: [true, "Please provide your username"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please provide your email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please provide your password"],
    },
    role: {
      type: String,
      enum: {
        values: [
          UserRole.MERCHANT,
          UserRole.ADMIN,
          UserRole.USER,
        ],
        message: "Invalid user role",
      },
      required: [true, "Please provide your role"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// hash password and take username to lowercase for every user document before saving them
USER_SCHEMA.pre("save", async function () {
  if (this.isModified("password")) {
    console.log("password is modified");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("username")) {
    this.username = this.username.toLowerCase();
  }
});

export const userModel = mongoose.model<IUser>(
  "USER",
  USER_SCHEMA
);
