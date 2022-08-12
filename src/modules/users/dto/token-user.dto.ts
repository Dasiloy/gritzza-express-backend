import { UserRole } from "../users.model";

export class TokenUserDto {
  username!: string;
  id!: string;
  role!: UserRole;
}
