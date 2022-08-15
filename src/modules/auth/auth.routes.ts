import { Router } from "express";
import authController from "./auth.controller";

const router = Router();

// sign up user
router.post("/signup", authController.signUp);

// sign in user
router.post("/signin", authController.signIn);

// // resend verification token
router.post(
  "/resend-verification-token",
  authController.resendVerificationToken
);

// // verify user
router.post("/verify-email", authController.verifyUser);

// forgot password
router.post(
  "/forgot-password",
  authController.forgotPassword
);

// resend forgot password token
router.post(
  "/resend-password-token",
  authController.resendPasswordResetToken
);

// reset password
router.post(
  "/reset-password",
  authController.resetPassword
);

export default router;
