import crypto from "crypto";
import { UserService } from "../../../modules/users/user.service";
import { ThrowException } from "../../../exceptions/throw-exception";
import { resetPasswordTokenModel } from "./resetPasswordToken.model";

export class ResetpasswordTokenservice {
  private resetPasswordTokenModel = resetPasswordTokenModel;
  private userService: UserService = new UserService();
  private TOKEN_EXPIRATION = 60 * 60 * 1000;

  private createHash(): string {
    const token = crypto.randomBytes(32).toString("hex");
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }

  private checkPasswordAgainstRegex(password: string) {
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      ThrowException.badRequest(
        "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character"
      );
    }
  }

  // find verification token with the token and user
  private async findToken(token: string, userId: string) {
    const resetPasswordToken =
      await this.resetPasswordTokenModel.findOne({
        token,
        user: userId,
      });

    if (!resetPasswordToken) {
      ThrowException.unAuthenticated("Invalid token");
    } else if (
      Date.now() >
      new Date(resetPasswordToken?.expiresAt!)?.getTime()
    ) {
      ThrowException.unAuthenticated("Token expired");
    }
    return resetPasswordToken;
  }
  // create verification token
  public async createToken(userId: string) {
    const token = this.createHash();
    return this.resetPasswordTokenModel.create({
      token,
      user: userId,
      expiresAt: new Date(
        Date.now() + this.TOKEN_EXPIRATION
      ),
    });
  }

  // resend token
  public async resendToken(userId: string) {
    const existingToken =
      await this.resetPasswordTokenModel.findOne({
        user: userId,
      });

    if (existingToken) {
      return existingToken;
    }
    return this.createToken(userId);
  }

  // validate token
  public async validateToken(
    token: string,
    email: string,
    password: string
  ) {
    if (!token || !email || !password) {
      ThrowException.badRequest(
        "token, email and password are required"
      );
    }
    // find user with the email
    const user = await this.userService.findByEmail(email);

    // find verification token with the token and user
    const resetPasswordToken = await this.findToken(
      token,
      user?._id as unknown as string
    );
    // update user status to active
    if (user) {
      this.checkPasswordAgainstRegex(password);
      user.password = password;
      await user.save();
    }
    if (resetPasswordToken) {
      await resetPasswordToken.remove();
    }
  }
}
