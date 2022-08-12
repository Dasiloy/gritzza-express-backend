"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationTokenModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// token expiration set for 1 hour
const TOKEN_EXPIRATION = 60 * 60 * 1000;
const VERIFICATION_TOKEN_SCHEMA = new mongoose_1.default.Schema({
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
        default: new Date(Date.now() + TOKEN_EXPIRATION),
    },
}, {
    timestamps: true,
});
exports.verificationTokenModel = mongoose_1.default.model("VERIFICATION_TOKEN", VERIFICATION_TOKEN_SCHEMA);
