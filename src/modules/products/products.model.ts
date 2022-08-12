import mongoose from "mongoose";

const { Schema, model } = mongoose;

export enum productCategory {
  Electronics = "Electronics",
  Fashion = "Fashion",
  Books = "Books",
  Sports = "Sports",
  Home = "Home",
  Toys = "Toys",
  Health = "Health",
  Automotive = "Automotive",
  Other = "Other",
}

export interface IProduct extends mongoose.Document {
  name: string;
  price: number;
  description: string;
  image: string;
  category: productCategory;
  featured: boolean;
  freeDelivery: boolean;
  inventory: number;
  averageRating: number;
  numberOfReviews: number;
  store: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PRODUCT_SCHEMA = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      minlength: [
        3,
        "product name cannot be less than 3 chracters",
      ],
      maxlength: [
        20,
        "product name cannot be more than 20 characters",
      ],
    },
    description: {
      type: String,
      trim: true,
      required: [
        true,
        "Please provide product description",
      ],
      minlength: [
        10,
        "product description cannot be less than 10 chracters",
      ],
      maxlength: [
        1000,
        "product description cannot be more than 20 characters",
      ],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Please provide product image"],
      default: "/uploads/images/couch.jpeg",
    },
    category: {
      type: String,
      required: [true, "please provide product category"],
      enum: {
        values: [
          productCategory.Electronics,
          productCategory.Fashion,
          productCategory.Books,
          productCategory.Sports,
          productCategory.Home,
          productCategory.Toys,
          productCategory.Health,
          productCategory.Automotive,
          productCategory.Other,
        ],
        message: "Please provide a valid product category",
      },
      default: productCategory.Other,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, "Please provide product inventory"],
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    store: {
      type: mongoose.Types.ObjectId,
      ref: "STORE",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

PRODUCT_SCHEMA.virtual("reviews", {
  ref: "REVIEW",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

PRODUCT_SCHEMA.pre("remove", async function (next) {
  await this.$model("REVIEW").deleteMany({
    product: this._id,
  });
  next();
});

export const productModel = model<IProduct>(
  "PRODUCT",
  PRODUCT_SCHEMA
);
