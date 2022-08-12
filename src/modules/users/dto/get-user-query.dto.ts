import { UserRole } from "../users.model";

export class GetUserQueryDto {
  constructor(
    public username?: string,
    public active?: boolean,
    public role?: UserRole
  ) {}
}

export class GetuserQueryDtoMongo {
  username!: {
    $regex: string;
    $options: string;
  };
  active!: boolean;
  role!: UserRole;
}
