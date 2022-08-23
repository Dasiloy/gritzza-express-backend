import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ThrowException } from "../../exceptions/throw-exception";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/log-in-user.dto";
import { AuthService } from "./auth.service";

// handler for POST /api/auth/signup
async function signUp(req: Request, res: Response) {
  const createuserDto: CreateUserDto = req.body;
  const authService = new AuthService();
  const user = await authService.signUp(createuserDto);
  res.status(StatusCodes.CREATED).json({
    email: user.email,
    username: user.username,
  });
}

// handler for POST /api/auth/signin
async function signIn(req: Request, res: Response) {
  const loginUserDto: LoginUserDto = req.body;
  const authService = new AuthService();
  const { token, tokenUser } = await authService.signIn(
    loginUserDto
  );
  res.status(StatusCodes.OK).json({
    token,
    user: tokenUser,
  });
}

// handler for POST /api/auth/verify
async function verifyUser(req: Request, res: Response) {
  const authService = new AuthService();

  if (!req.body.token || !req.body.email) {
    ThrowException.badRequest(
      "Token and email are required"
    );
  }

  await authService.verifyUser(
    req.body.token,
    req.body.email
  );
  res.status(StatusCodes.OK).send();
}

// handler for POST /api/auth/resend-verification-token
async function resendVerificationToken(
  req: Request,
  res: Response
) {
  const authService = new AuthService();
  await authService.resendVerificationToken(req.body.email);
  res.status(StatusCodes.OK).send();
}

// handler for POST /api/auth/forgot-password
async function forgotPassword(req: Request, res: Response) {
  const authService = new AuthService();
  await authService.forgotPassword(req.body.email);
  res.status(StatusCodes.OK).send();
}

//handler for POST resend password reset token
async function resendPasswordResetToken(
  req: Request,
  res: Response
) {
  const authService = new AuthService();
  await authService.resendPasswordResetToken(
    req.body.email
  );
  res.status(StatusCodes.OK).send();
}

// handler for POST /api/auth/reset-password
async function resetPassword(req: Request, res: Response) {
  const { token, email, password } = req.body;
  const authService = new AuthService();
  await authService.resetPassword(token, email, password);
  res.status(StatusCodes.OK).send();
}

export default {
  signUp,
  signIn,
  verifyUser,
  resendVerificationToken,
  forgotPassword,
  resendPasswordResetToken,
  resetPassword,
};
