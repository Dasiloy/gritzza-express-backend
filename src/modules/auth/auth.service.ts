import bcrypt from "bcryptjs";
import {
  LoginMethod,
  UserService,
} from "../users/user.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { EmailService } from "../../services/email/email.service";
import { verificationTokenService } from "../../services/token/verification/verification-token.service";
import { IUser } from "../users/users.model";
import { ThrowException } from "../../exceptions/throw-exception";
import { ResetpasswordTokenservice } from "../../services/token/password-reset/reset-password.service";
import { TokenCreator } from "../../services/token/payload-token.service";
import isEmail from "validator/lib/isEmail";
import { LoginUserDto } from "../users/dto/log-in-user.dto";

export class AuthService {
  private userService: UserService = new UserService();
  private emailService: EmailService = new EmailService();
  private verificationTokenService: verificationTokenService =
    new verificationTokenService();
  private resetPasswordService =
    new ResetpasswordTokenservice();

  private async comparePassword(
    password: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // sign up user
  public async signUp(createuserDto: CreateUserDto) {
    // create user
    const user = await this.userService.createUserBySignUp(
      createuserDto
    );

    // create a new verification token
    const verificationToken =
      await this.verificationTokenService.createToken(
        user._id as unknown as string
      );

    // trigger email verification
    await this.emailService.sendVerificationEmail({
      email: user.email,
      token: verificationToken.token,
      name: user.username,
    });
    return {
      user,
      token: verificationToken.token,
    };
  }

  // verify user
  public async verifyUser(token: string, email: string) {
    if (!email || !token) {
      ThrowException.badRequest(
        "email and token are required"
      );
    }

    return this.verificationTokenService.validateToken(
      token,
      email
    );
  }

  // resend verification token
  public async resendVerificationToken(email: string) {
    if (!email) {
      ThrowException.badRequest("email is required");
    }

    const user = await this.userService.findByEmail(email); // find user  by mail

    if (user) {
      if (user.verified) {
        ThrowException.badRequest("User already verified");
      }

      const resendToken =
        await this.verificationTokenService.resendToken(
          user?.id as string
        );

      // trigger email verification
      await this.emailService.sendVerificationEmail({
        email: user.email,
        token: resendToken.token,
        name: user.username,
      });
      return resendToken.token;
    }
  }

  // sign in user
  public async signIn(loginUserDto: LoginUserDto) {
    let method: LoginMethod;
    let identifier = loginUserDto.identifier;

    if (
      !loginUserDto.identifier ||
      !loginUserDto.password
    ) {
      ThrowException.badRequest(
        "Username or email is required"
      );
    }

    const isActualEmail = isEmail(loginUserDto.identifier);

    if (isActualEmail) {
      method = LoginMethod.EMAIL;
    } else {
      method = LoginMethod.USERNAME;
    }

    // find user by identifier
    const user = await this.userService.findByIdentifier(
      identifier,
      method
    );

    // if user not found
    if (!user) {
      ThrowException.unAuthenticated("invalid credentials");
    }

    if (!user?.verified) {
      ThrowException.unAuthenticated("User not verified");
    }

    // if user is not active
    if (!user?.active) {
      ThrowException.unAuthenticated(
        "Your account has been restricted"
      );
    }

    //compare password
    const isValid = await this.comparePassword(
      loginUserDto.password,
      user?.password as string
    );

    if (!isValid) {
      ThrowException.unAuthenticated("invalid credentials");
    }

    const tokenInstance = TokenCreator.getInstance(
      user as IUser
    ); // create a token instance
    const token = tokenInstance.createToken(); // gets the users token
    const tokenUser = tokenInstance.getTokenUser(); // gets the users token
    return {
      token,
      tokenUser,
    };
  }

  // forgot password
  public async forgotPassword(email: string) {
    if (!email) {
      ThrowException.badRequest("email is required");
    }

    const user = await this.userService.findByEmail(email); // find user  by mail

    const passwordResetToken =
      await this.resetPasswordService.createToken(user?.id);

    if (user) {
      // trigger email verification
      await this.emailService.sendPasswordResetEmail({
        email: user.email,
        token: passwordResetToken.token as string,
        name: user.username,
      });
      return passwordResetToken.token;
    }
  }

  // resend password reset token
  public async resendPasswordResetToken(email: string) {
    if (!email) {
      ThrowException.badRequest("email is required");
    }

    const user = await this.userService.findByEmail(email); // find user  by mail

    const resendToken =
      await this.resetPasswordService.resendToken(
        user?.id as string
      ); // find or create a new reset token

    // trigger email verification
    await this.emailService.sendPasswordResetEmail({
      email: user?.email as string,
      token: resendToken?.token as string,
      name: user?.username as string,
    });
    return resendToken.token;
  }

  // reset password
  public async resetPassword(
    token: string,
    email: string,
    password: string
  ) {
    return this.resetPasswordService.validateToken(
      token,
      email,
      password
    );
  }
}
