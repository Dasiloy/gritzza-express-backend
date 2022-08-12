import { NextFunction, Request,Response } from "express";
import { ThrowException } from "../exceptions/throw-exception";
import { UserResponseDto } from "../modules/users/dto/single-user-response.dto";
import { UserRole } from "../modules/users/users.model";

export const userPermissions = (...roles: UserRole[]) => {
  return (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
    const user =
      req.user! as UserResponseDto;
    if (roles.includes(user.role)) {
      next();
    } else {
      ThrowException.unAuthorized(
        "You are not authorized to perform this action"
      );
    }
  };
};
