import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  IUser,
  UserRole,
} from "../../modules/users/users.model";

export interface TokenUser {
  id: string;
  role: UserRole;
  username: string;
}

export class TokenCreator {
  private static instance: TokenCreator;
  private token: string | null = null;
  readonly tokenUser: TokenUser;
  private secretKey: string;
  private email: string;

  private constructor(user: IUser) {
    this.email = user.email;
    this.secretKey = process.env.JWT_SECRET!;
    this.tokenUser = this.createTokenUser(user);
  }

  // create a new instance of the class
  public static getInstance(user: IUser): TokenCreator {
    TokenCreator.instance = new TokenCreator(user);
    return TokenCreator.instance;
  }

  // token getter
  public getToken(): string | null {
    return this.token;
  }

  // email getter
  public getEmail(): string {
    return this.email;
  }

  // token user getter
  public getTokenUser(): TokenUser {
    return this.tokenUser;
  }

  // create a token user
  private createTokenUser(user: IUser): TokenUser {
    return {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    };
  }

  // create a token
  public createToken(): string {
    const token = jwt.sign(this.tokenUser, this.secretKey);
    this.token = token;
    return token;
  }

  // verify token
  public verifyToken(token: string) {
    return jwt.verify(token, this.secretKey);
  }

  // create a hashed string
  public createHash(): string {
    const token = crypto.randomBytes(32).toString("hex");
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }
}
