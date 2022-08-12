"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const REVIEW_MODEL = new Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "USER",
        required: [true, "Please provide your user"],
    },
    product: {
        type: mongoose_1.default.Types.ObjectId,
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
}, {
    timestamps: true,
});
// user can have only one review per product
REVIEW_MODEL.index({ user: 1, product: 1 }, { unique: true });
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
exports.reviewModel = model("REVIEW", REVIEW_MODEL);
