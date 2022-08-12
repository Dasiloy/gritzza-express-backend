import mongoose from "mongoose";

export enum StoreStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IStore extends mongoose.Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  description: string;
  displayPic: string;
  status: StoreStatus;
  location: string;
  contact?: string;
  isPublic: boolean;
  likes: Array<mongoose.Types.ObjectId>;
  followers: Array<mongoose.Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}

const STORE_SCHEMA = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      unique: true,
      required: [
        true,
        "Please provide the owner of the store",
      ],
    },
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Name is required"],
      minlength: [
        4,
        "Name must be at least 4 characters long",
      ],
      maxlength: [
        50,
        "Name cannot be more than 50 characters",
      ],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
      minlength: [
        20,
        "Description must be at least 20 characters long",
      ],
      maxlength: [
        500,
        "Description cannot be more than 500 characters",
      ],
    },
    displayPic: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/dzqbzqgjw/image/upload/v1599098981/store_default_image_xqjqjq.png",
    },
    location: {
      type: String,
      trim: true,
      required: [true, "Location is required"],
    },
    contact: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          StoreStatus.ACTIVE,
          StoreStatus.INACTIVE,
          StoreStatus.BLOCKED,
        ],
        message:
          "Invalid store status: {VALUE}, Status can be either ACTIVE, INACTIVE or BLOCKED",
      },
      default: StoreStatus.ACTIVE,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "USER",
      default: [],
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "USER",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const storeModel = mongoose.model<IStore>(
  "STORE",
  STORE_SCHEMA
);
