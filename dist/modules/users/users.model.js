"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.UserRole = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
var UserRole;
(function (UserRole) {
    UserRole["MERCHANT"] = "merchant";
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "customer";
    UserRole["AGENT"] = "agent";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
const USER_SCHEMA = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
// hash password and take username to lowercase for every user document before saving them
USER_SCHEMA.pre("save", async function () {
    if (this.isModified("password")) {
        console.log("password is modified");
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
    }
    if (this.isModified("username")) {
        this.username = this.username.toLowerCase();
    }
});
exports.userModel = mongoose_1.default.model("USER", USER_SCHEMA);
