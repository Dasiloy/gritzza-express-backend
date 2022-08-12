"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = exports.productCategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
var productCategory;
(function (productCategory) {
    productCategory["Electronics"] = "Electronics";
    productCategory["Fashion"] = "Fashion";
    productCategory["Books"] = "Books";
    productCategory["Sports"] = "Sports";
    productCategory["Home"] = "Home";
    productCategory["Toys"] = "Toys";
    productCategory["Health"] = "Health";
    productCategory["Automotive"] = "Automotive";
    productCategory["Other"] = "Other";
})(productCategory = exports.productCategory || (exports.productCategory = {}));
const PRODUCT_SCHEMA = new Schema({
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
        type: mongoose_1.default.Types.ObjectId,
        ref: "STORE",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
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
exports.productModel = model("PRODUCT", PRODUCT_SCHEMA);
