"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("./user.service");
const throw_exception_1 = require("../../exceptions/throw-exception");
const single_user_response_dto_1 = require("./dto/single-user-response.dto");
const admin_create_user_response_dto_1 = require("./dto/admin-create-user-response.dto");
const email_service_1 = require("../../services/email/email.service");
// handler for GET /users/show/
async function getUserFromQuery(req, res) {
    const userService = new user_service_1.UserService();
    const user = await userService.getUserFromQuery(req);
    const userDto = new single_user_response_dto_1.UserResponseDto(user);
    res.status(http_status_codes_1.StatusCodes.OK).json(userDto);
}
// handler for GET /users/admin/
async function getAllUsers(req, res) {
    const userService = new user_service_1.UserService();
    const users = await userService.getAllUsers();
    const usersDto = users.map(user => new single_user_response_dto_1.UserResponseDto(user));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        count: users.length,
        users: usersDto,
    });
}
// handler for GET /users/admin/search
async function getUsers(req, res) {
    const userService = new user_service_1.UserService();
    const queryDto = req.query;
    const users = await userService.getUsers(queryDto);
    const usersDto = users.map(user => new single_user_response_dto_1.UserResponseDto(user));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        count: users.length,
        search: queryDto,
        users: usersDto,
    });
}
//   // handler for POST /users/admin
async function createUser(req, res) {
    const userService = new user_service_1.UserService();
    const emailService = new email_service_1.EmailService();
    const createUserDto = req.body;
    const user = await userService.createUserByAdmin(createUserDto);
    const userResponse = new admin_create_user_response_dto_1.UserResponseAdminDto(user);
    userResponse.password = createUserDto.password;
    await emailService.sendUserCredentialsEmail({
        email: userResponse.email,
        password: userResponse.password,
        username: userResponse.username,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json(userResponse);
}
// handler for GET /users/:id/
async function getUserById(req, res) {
    const userService = new user_service_1.UserService();
    const id = req.params.id;
    const user = await userService.getUserById(id, req);
    const userDto = new single_user_response_dto_1.UserResponseDto(user);
    res.status(http_status_codes_1.StatusCodes.OK).json(userDto);
}
// handler for PATCH /users/:id/
async function updateUser(req, res) {
    const userService = new user_service_1.UserService();
    const id = req.params.id;
    const updateUserDto = req.body;
    const user = await userService.updateUser(id, updateUserDto, req);
    const userDto = new single_user_response_dto_1.UserResponseDto(user);
    res.status(http_status_codes_1.StatusCodes.OK).json(userDto);
}
// handler for PATCH /users/:id/password
async function updateUserPassword(req, res) {
    const userService = new user_service_1.UserService();
    const id = req.params.id;
    const updateUserPasswordDto = req.body;
    if (!updateUserPasswordDto.oldPassword ||
        !updateUserPasswordDto.newPassword) {
        throw_exception_1.ThrowException.badRequest("oldPassword and newPassword are required");
    }
    if (updateUserPasswordDto.oldPassword ===
        updateUserPasswordDto.newPassword) {
        throw_exception_1.ThrowException.badRequest("oldPassword and newPassword must be different");
    }
    const user = await userService.updateUserPassword(id, updateUserPasswordDto, req);
    const userDto = new single_user_response_dto_1.UserResponseDto(user);
    res.status(http_status_codes_1.StatusCodes.OK).json(userDto);
}
// handler for patch /users/admin/status
async function changeUserStatus(req, res) {
    const userService = new user_service_1.UserService();
    const updateUserStatusDto = req.body;
    if (!updateUserStatusDto.userId) {
        throw_exception_1.ThrowException.badRequest("userId is required");
    }
    const user = await userService.changeUserActiveStatus(updateUserStatusDto, req);
    const userDto = new single_user_response_dto_1.UserResponseDto(user);
    res.status(http_status_codes_1.StatusCodes.OK).json(userDto);
}
// handler for DELETE /users/:id/
async function deleteUser(req, res) {
    const userService = new user_service_1.UserService();
    const deleteUserDto = {
        userId: req.params.id,
    };
    await userService.deleteUser(deleteUserDto, req);
    res.status(http_status_codes_1.StatusCodes.OK).send();
}
// handler for DELETE /users/admin/
async function deleteUserByAdmin(req, res) {
    const userService = new user_service_1.UserService();
    const deleteUserDto = req.body;
    if (!deleteUserDto.userId) {
        throw_exception_1.ThrowException.badRequest("userId is required");
    }
    await userService.deleteUser(deleteUserDto, req);
    res.status(http_status_codes_1.StatusCodes.OK).send();
}
exports.default = {
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
