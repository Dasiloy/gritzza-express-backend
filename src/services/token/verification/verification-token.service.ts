import crypto from "crypto";
import { ThrowException } from "../../../exceptions/throw-exception";
import { UserService } from "../../../modules/users/user.service";
import { verificationTokenModel } from "./verificationToken.model";

export class verificationTokenService {
  private verificationTokenModel = verificationTokenModel;
  private userService: UserService = new UserService();
  private TOKEN_EXPIRATION = 60 * 1000 * 10; // 10 minutes

  private createHash(): string {
    const token = crypto.randomBytes(32).toString("hex");
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }

  // find verification token with the token and user
  private async findToken(token: string, userId: string) {
    const verificationToken =
      await this.verificationTokenModel.findOne({
        token,
        user: userId,
      });

    if (!verificationToken) {
      ThrowException.badRequest("Invalid token");
    } else if (
      Date.now() >
      new Date(verificationToken?.expiresAt!).getTime()
    ) {
      ThrowException.badRequest("Token expired");
    }

    return verificationToken;
  }

  // create verification token
  public async createToken(userId: string) {
    const token = this.createHash();
    return this.verificationTokenModel.create({
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
      await this.verificationTokenModel.findOne({
        user: userId,
      });

    if (existingToken) {
      if (
        Date.now() >
        new Date(existingToken?.expiresAt!).getTime()
      ) {
        await existingToken.remove();
      } else {
        return existingToken;
      }
    }
    return this.createToken(userId);
  }

  // validate token
  public async validateToken(token: string, email: string) {
    // find user with the email
    const user =
      await this.userService.findByEmailWithNoVerification(
        email
      );

    if (!user) {
      ThrowException.badRequest("Invalid credentials");
    }

    if (user?.verified) {
      ThrowException.badRequest("User already verified");
    }

    // find verification token with the token and user
    const verificationToken = await this.findToken(
      token,
      user?._id as unknown as string
    );
    // update user verification to true
    if (user) {
      user.verified = true;
      await user.save();
    }
    if (verificationToken) {
      await verificationToken.remove();
    }
  }
}
