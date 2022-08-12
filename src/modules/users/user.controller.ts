import { Request, Response } from "express";
import { GetUserQueryDto } from "./dto/get-user-query.dto";
import { StatusCodes } from "http-status-codes";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { AdminUpdateUserStatusDto } from "./dto/admin-update-user-status";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { DeleteuserDto } from "./dto/delete-user.dto";
import { ThrowException } from "../../exceptions/throw-exception";
import { UserResponseDto } from "./dto/single-user-response.dto";
import { UserResponseAdminDto } from "./dto/admin-create-user-response.dto";
import { IUser } from "./users.model";
import { EmailService } from "../../services/email/email.service";

// handler for GET /users/show/
async function getUserFromQuery(
  req: Request,
  res: Response
) {
  const userService = new UserService();
  const user = await userService.getUserFromQuery(req);
  const userDto = new UserResponseDto(user as IUser);
  res.status(StatusCodes.OK).json(userDto);
}

// handler for GET /users/admin/
async function getAllUsers(req: Request, res: Response) {
  const userService = new UserService();
  const users = await userService.getAllUsers();
  const usersDto = users.map(
    user => new UserResponseDto(user)
  );
  res.status(StatusCodes.OK).json({
    count: users.length,
    users: usersDto,
  });
}

// handler for GET /users/admin/search
async function getUsers(req: Request, res: Response) {
  const userService = new UserService();
  const queryDto: GetUserQueryDto = req.query;
  const users = await userService.getUsers(queryDto);
  const usersDto = users.map(
    user => new UserResponseDto(user)
  );
  res.status(StatusCodes.OK).json({
    count: users.length,
    search: queryDto,
    users: usersDto,
  });
}
//   // handler for POST /users/admin
async function createUser(req: Request, res: Response) {
  const userService = new UserService();
  const emailService = new EmailService();
  const createUserDto: CreateUserDto = req.body;
  const user = await userService.createUserByAdmin(
    createUserDto
  );
  const userResponse = new UserResponseAdminDto(
    user as IUser
  );
  userResponse.password = createUserDto.password;
  await emailService.sendUserCredentialsEmail({
    email: userResponse.email,
    password: userResponse.password,
    username: userResponse.username,
  });
  res.status(StatusCodes.CREATED).json(userResponse);
}

// handler for GET /users/:id/
async function getUserById(req: Request, res: Response) {
  const userService = new UserService();
  const id = req.params.id;
  const user = await userService.getUserById(id, req);
  const userDto = new UserResponseDto(user);
  res.status(StatusCodes.OK).json(userDto);
}

// handler for PATCH /users/:id/
async function updateUser(req: Request, res: Response) {
  const userService = new UserService();
  const id = req.params.id;
  const updateUserDto: CreateUserDto = req.body;
  const user = await userService.updateUser(
    id,
    updateUserDto,
    req
  );
  const userDto = new UserResponseDto(user);
  res.status(StatusCodes.OK).json(userDto);
}

// handler for PATCH /users/:id/password
async function updateUserPassword(
  req: Request,
  res: Response
) {
  const userService = new UserService();
  const id = req.params.id;
  const updateUserPasswordDto: UpdateUserPasswordDto =
    req.body;

  if (
    !updateUserPasswordDto.oldPassword ||
    !updateUserPasswordDto.newPassword
  ) {
    ThrowException.badRequest(
      "oldPassword and newPassword are required"
    );
  }

  if (
    updateUserPasswordDto.oldPassword ===
    updateUserPasswordDto.newPassword
  ) {
    ThrowException.badRequest(
      "oldPassword and newPassword must be different"
    );
  }

  const user = await userService.updateUserPassword(
    id,
    updateUserPasswordDto,
    req
  );
  const userDto = new UserResponseDto(user);
  res.status(StatusCodes.OK).json(userDto);
}

// handler for patch /users/admin/status
async function changeUserStatus(
  req: Request,
  res: Response
) {
  const userService = new UserService();
  const updateUserStatusDto: AdminUpdateUserStatusDto =
    req.body;
  if (!updateUserStatusDto.userId) {
    ThrowException.badRequest("userId is required");
  }

  const user = await userService.changeUserActiveStatus(
    updateUserStatusDto,
    req
  );
  const userDto = new UserResponseDto(user);
  res.status(StatusCodes.OK).json(userDto);
}

// handler for DELETE /users/:id/
async function deleteUser(req: Request, res: Response) {
  const userService = new UserService();
  const deleteUserDto: DeleteuserDto = {
    userId: req.params.id,
  };
  await userService.deleteUser(deleteUserDto, req);
  res.status(StatusCodes.OK).send();
}

// handler for DELETE /users/admin/
async function deleteUserByAdmin(
  req: Request,
  res: Response
) {
  const userService = new UserService();
  const deleteUserDto: DeleteuserDto = req.body;

  if (!deleteUserDto.userId) {
    ThrowException.badRequest("userId is required");
  }

  await userService.deleteUser(deleteUserDto, req);
  res.status(StatusCodes.OK).send();
}

export default {
  getUserFromQuery,
  getAllUsers,
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateUserPassword,
  changeUserStatus,
  deleteUser,
  deleteUserByAdmin,
};
