import bcrypt from "bcryptjs";
import { ThrowException } from "../../exceptions/throw-exception";
import { CreateUserDto } from "./dto/create-user.dto";
import {
  GetUserQueryDto,
  GetuserQueryDtoMongo,
} from "./dto/get-user-query.dto";
import {
  userModel,
  IUser,
  IUserOrNull,
  UserRole,
} from "./users.model";
import { Request } from "express";
import { AdminUpdateUserStatusDto } from "./dto/admin-update-user-status";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { DeleteuserDto } from "./dto/delete-user.dto";
import { UserResponseDto } from "./dto/single-user-response.dto";

export enum LoginMethod {
  EMAIL = "email",
  USERNAME = "username",
  INVALID = "invalid",
}

export class UserService {
  private UserModel = userModel;

  private async comparePassword(
    password: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(password, hashedPassword);
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

  // create user
  public async createUser(createUserDto: CreateUserDto) {
    // temp for new user
    const newUserTemp = {
      username: createUserDto.username,
      password: createUserDto.password,
      email: createUserDto.email,
      role: createUserDto.role,
      verified: createUserDto.verified,
    };

    // check if password matches the regex
    this.checkPasswordAgainstRegex(createUserDto.password);

    // check for existing user by email
    const existingUserByEmail =
      await this.UserModel.findOne({
        email: newUserTemp.email,
      });
    if (existingUserByEmail) {
      const isVerified = existingUserByEmail.verified;
      ThrowException.conflict(
        isVerified
          ? "User with this email already exists"
          : "Verify your email"
      );
    }

    // check for existing user by username
    const existingUserByUsername =
      await this.UserModel.findOne({
        username: newUserTemp.username,
      });
    if (existingUserByUsername) {
      const isVerified = existingUserByUsername.verified;
      ThrowException.conflict(
        isVerified
          ? "User with this username already exists"
          : "Verify your email"
      );
    }
    // create user
    return userModel.create(newUserTemp);
  }

  // create user by admin
  public async createUserByAdmin(
    createUserDto: CreateUserDto
  ) {
    createUserDto.verified = true;
    const user = await this.createUser(createUserDto);
    return user;
  }

  // create user by signUp
  public async createUserBySignUp(
    createUserDto: CreateUserDto
  ) {
    createUserDto.verified = false;
    if (createUserDto.role === UserRole.ADMIN) {
      ThrowException.badRequest("Invalid role");
    }
    return this.createUser(createUserDto);
  }

  // get user from query
  public async getUserFromQuery(req: Request) {
    return req.user!;
  }

  // get all users
  public async getAllUsers(): Promise<IUser[]> {
    return this.UserModel.find({});
  }

  // get users
  public async getUsers(
    queryDto: GetUserQueryDto
  ): Promise<IUser[]> {
    const queryObject: Partial<GetuserQueryDtoMongo> = {};
    if (queryDto.username) {
      queryObject.username = {
        $regex: queryDto.username,
        $options: "i",
      };
    }
    if (queryDto.role) {
      queryObject.role = queryDto.role;
    }
    if (queryDto.active) {
      queryObject.active = queryDto.active;
    }
    return this.UserModel.find(queryObject);
  }

  //check user
  private async checkUser(id: string, req: Request) {
    const user = await this.UserModel.findById(id);
    const loggenInUser = this.getUserFromQuery(
      req
    ) as Promise<Express.User> & UserResponseDto;
    if (!user) {
      ThrowException.notFound("User not found");
    }
    // check if user is admin or the current user is the one requesting his document
    if (
      user?.role !== UserRole.ADMIN &&
      user?._id.toHexString() !== loggenInUser._id
    ) {
      ThrowException.notFound("User not found for you");
    }

    return user;
  }

  // find by id
  public async findById(
    userId: string
  ): Promise<IUserOrNull> {
    return this.UserModel.findById(userId);
  }

  // find by email
  public async findByEmail(email: string) {
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      ThrowException.unAuthenticated("invalid credentials");
    }
    return user;
  }

  // find by username
  public async findByUsername(username: string) {
    const user = await this.UserModel.findOne({ username });
    if (!user) {
      ThrowException.unAuthenticated("invalid credentials");
    }
    return user;
  }

  public async findByIdentifier(
    identifier: string,
    method: LoginMethod
  ) {
    switch (method) {
      case LoginMethod.USERNAME:
        return this.findByUsername(identifier);
      case LoginMethod.EMAIL:
        return this.findByEmail(identifier);
      default:
        ThrowException.badRequest("Invalid identifier");
    }
  }

  // get user by id
  public async getUserById(
    id: string,
    req: Request
  ): Promise<IUser> {
    const user = (await this.checkUser(id, req)) as IUser;
    return user;
  }

  // update user
  public async updateUser(
    id: string,
    updateUserDto: CreateUserDto,
    req: Request
  ): Promise<IUser> {
    const user = (await this.checkUser(id, req)) as IUser;
    if (updateUserDto.username) {
      const userWiththesameUsername =
        await this.findByUsername(
          updateUserDto.username.toLowerCase()
        );
      if (userWiththesameUsername) {
        ThrowException.conflict(
          "User with this username already exists"
        );
      }
      user!.username = updateUserDto.username;
    }
    return user.save();
  }

  // update user's active status
  public async changeUserActiveStatus(
    adminUpdateUserStatus: AdminUpdateUserStatusDto,
    req: Request
  ) {
    const { userId, active } = adminUpdateUserStatus;
    const user = (await this.checkUser(
      userId,
      req
    )) as IUser;
    user.active = active;
    return user.save();
  }

  // update user password
  public async updateUserPassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
    req: Request
  ): Promise<IUser> {
    const { oldPassword, newPassword } =
      updateUserPasswordDto;
    const user = (await this.checkUser(id, req)) as IUser;

    const validPassword = await this.comparePassword(
      oldPassword,
      user.password
    );

    if (!validPassword) {
      ThrowException.unAuthenticated("invalid credentials");
    }

    user.password = newPassword;
    return user.save();
  }

  // delete user
  public async deleteUser(
    deleteUserDto: DeleteuserDto,
    req: Request
  ): Promise<IUser> {
    const { userId } = deleteUserDto;
    const user = (await this.checkUser(
      userId,
      req
    )) as IUser;
    return user.remove();
  }
}
