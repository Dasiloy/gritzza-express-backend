import { UserRole } from "../users.model";

export class CreateUserDto {
  username!: string;
  password!: string;
  email!: string;
  role!: UserRole;
}
