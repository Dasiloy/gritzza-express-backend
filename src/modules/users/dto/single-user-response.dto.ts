import { IUser, UserRole } from "../users.model";

export class UserResponseDto {
  _id!: string;
  username!: string;
  email!: string;
  role!: UserRole;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(user: IUser) {
    this._id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.active = user.active;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
