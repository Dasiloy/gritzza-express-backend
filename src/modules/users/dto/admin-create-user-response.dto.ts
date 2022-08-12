import { IUser } from "../users.model";

export class UserResponseAdminDto {
  email!: string;
  role!: string;
  username!: string;
  password!: string;

  constructor(user: IUser) {
    this.email = user.email;
    this.role = user.role;
    this.username = user.username;
    this.password = user.password;
  }
}
