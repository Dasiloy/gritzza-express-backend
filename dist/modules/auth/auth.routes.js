"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const router = (0, express_1.Router)();
// sign up user
router.post("/signup", auth_controller_1.default.signUp);
// sign in user
router.post("/signin", auth_controller_1.default.signIn);
// // resend verification token
router.post("/resend-verification-token", auth_controller_1.default.resendVerificationToken);
// // verify user
router.post("/verify-email", auth_controller_1.default.verifyUser);
// forgot password
router.post("/forgot-password", auth_controller_1.default.forgotPassword);
// resend forgot password token
router.post("/resend-password-token", auth_controller_1.default.resendPasswordResetToken);
// reset password
router.post("/reset-password", auth_controller_1.default.resetPassword);
exports.default = router;
