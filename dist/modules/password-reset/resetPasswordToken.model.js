"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordTokenModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RESET_PASSWORD_TOKEN_SCHEMA = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.resetPasswordTokenModel = mongoose_1.default.model("RESET_PASSWORD_TOKEN", RESET_PASSWORD_TOKEN_SCHEMA);
