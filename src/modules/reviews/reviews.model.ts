import mongoose from "mongoose";

const { Schema, model } = mongoose;

export interface IReview extends mongoose.Document { 
  product: mongoose.Schema.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const REVIEW_MODEL = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "USER",
      required: [true, "Please provide your user"],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "PRODUCT",
      required: [true, "Please provide your product"],
    },
    rating: {
      type: Number,
      required: [true, "Please provide your rating"],
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide your title"],
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [
        20,
        "Title must be less than 20 characters",
      ],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "Please provide your comment"],
      minlength: [
        5,
        "Comment must be at least 5 characters",
      ],
      maxlength: [
        50,
        "Comment must be less than 50 characters",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// user can have only one review per product
REVIEW_MODEL.index(
  { user: 1, product: 1 },
  { unique: true }
);

// REVIEW_MODEL.statics.calculateAverageRating =
//   async function (productId) {
//     //aggregate the reviews for the product
//     const result = await this.aggregate([
//       {
//         $match: {
//           product: productId,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           averageRating: {
//             $avg: "$rating",
//           },
//           numberOfReviews: {
//             $sum: 1,
//           },
//         },
//       },
//     ]);

//     await this.model("PRODUCT").findOneAndUpdate(
//       {
//         _id: productId,
//       },
//       {
//         averageRating: result[0]?.averageRating || 0,
//         numberOfReviews: result[0]?.numberOfReviews || 0,
//       }
//     );
//   };

// REVIEW_MODEL.post("save", async function () {
//   await this.constructor.calculateAverageRating(
//     this.product
//   );
// });

// REVIEW_MODEL.post("remove", async function () {
//   await this.constructor.calculateAverageRating(
//     this.product
//   );
// });

export const reviewModel = model<IReview>("REVIEW", REVIEW_MODEL);
