"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeModel = exports.StoreStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var StoreStatus;
(function (StoreStatus) {
    StoreStatus["ACTIVE"] = "ACTIVE";
    StoreStatus["INACTIVE"] = "INACTIVE";
    StoreStatus["BLOCKED"] = "BLOCKED";
})(StoreStatus = exports.StoreStatus || (exports.StoreStatus = {}));
const STORE_SCHEMA = new mongoose_1.default.Schema({
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        default: "https://res.cloudinary.com/dzqbzqgjw/image/upload/v1599098981/store_default_image_xqjqjq.png",
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
            message: "Invalid store status: {VALUE}, Status can be either ACTIVE, INACTIVE or BLOCKED",
        },
        default: StoreStatus.ACTIVE,
    },
    likes: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "USER",
        default: [],
    },
    followers: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "USER",
        default: [],
    },
}, {
    timestamps: true,
});
exports.storeModel = mongoose_1.default.model("STORE", STORE_SCHEMA);
