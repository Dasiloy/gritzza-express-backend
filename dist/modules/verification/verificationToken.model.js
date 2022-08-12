"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationTokenModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const VERIFICATION_TOKEN_SCHEMA = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.verificationTokenModel = mongoose_1.default.model("VERIFICATION_TOKEN", VERIFICATION_TOKEN_SCHEMA);
