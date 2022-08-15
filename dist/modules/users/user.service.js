"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = exports.LoginMethod = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const throw_exception_1 = require("../../exceptions/throw-exception");
const users_model_1 = require("./users.model");
var LoginMethod;
(function (LoginMethod) {
    LoginMethod["EMAIL"] = "email";
    LoginMethod["USERNAME"] = "username";
    LoginMethod["INVALID"] = "invalid";
})(LoginMethod = exports.LoginMethod || (exports.LoginMethod = {}));
class UserService {
    constructor() {
        this.UserModel = users_model_1.userModel;
    }
    async comparePassword(password, hashedPassword) {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
    checkPasswordAgainstRegex(password) {
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            throw_exception_1.ThrowException.badRequest("Password must contain at least one lowercase letter, one uppercase letter, one number and one special character");
        }
    }
    // create user
    async createUser(createUserDto, config = { isAdmin: false }) {
        // temp for new user
        const newUserTemp = {
            username: createUserDto.username,
            password: createUserDto.password,
            email: createUserDto.email,
            role: createUserDto.role,
        };
        // check if password matches the regex
        this.checkPasswordAgainstRegex(createUserDto.password);
        // check for existing user by email
        const existingUserByEmail = await this.UserModel.findOne({
            email: newUserTemp.email,
        });
        if (existingUserByEmail) {
            const isVerified = existingUserByEmail.verified;
            throw_exception_1.ThrowException.conflict(isVerified
                ? "User with this email already exists"
                : "Verify your email");
        }
        // check for existing user by username
        const existingUserByUsername = await this.UserModel.findOne({
            username: newUserTemp.username,
        });
        if (existingUserByUsername) {
            const isVerified = existingUserByUsername.verified;
            throw_exception_1.ThrowException.conflict(isVerified
                ? "User with this username already exists"
                : "Verify your email");
        }
        // create user
        return users_model_1.userModel.create(config.isAdmin
            ? { ...newUserTemp, verified: true }
            : { ...newUserTemp });
    }
    // create user by admin
    async createUserByAdmin(createUserDto) {
        const user = await this.createUser(createUserDto, {
            isAdmin: true,
        });
        return user;
    }
    // create user by signUp
    async createUserBySignUp(createUserDto) {
        if (createUserDto.role === users_model_1.UserRole.ADMIN) {
            throw_exception_1.ThrowException.badRequest("Only users can sign up");
        }
        return this.createUser(createUserDto);
    }
    // get user from query
    async getUserFromQuery(req) {
        return req.user;
    }
    // get all users
    async getAllUsers() {
        return this.UserModel.find({});
    }
    // get users
    async getUsers(queryDto) {
        const queryObject = {};
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
    async checkUser(id, req) {
        const user = await this.UserModel.findById(id);
        const loggenInUser = this.getUserFromQuery(req);
        if (!user) {
            throw_exception_1.ThrowException.notFound("User not found");
        }
        // check if user is admin or the current user is the one requesting his document
        if ((user === null || user === void 0 ? void 0 : user.role) !== users_model_1.UserRole.ADMIN &&
            (user === null || user === void 0 ? void 0 : user._id.toHexString()) !== loggenInUser._id) {
            throw_exception_1.ThrowException.notFound("User not found for you");
        }
        return user;
    }
    // find by id
    async findById(userId) {
        return this.UserModel.findById(userId);
    }
    // find by email
    async findByEmail(email) {
        const user = await this.UserModel.findOne({ email });
        if (!user) {
            throw_exception_1.ThrowException.unAuthenticated("invalid credentials");
        }
        return user;
    }
    // find by username
    async findByUsername(username) {
        const user = await this.UserModel.findOne({ username });
        if (!user) {
            throw_exception_1.ThrowException.unAuthenticated("invalid credentials");
        }
        return user;
    }
    async findByIdentifier(identifier, method) {
        switch (method) {
            case LoginMethod.USERNAME:
                return this.findByUsername(identifier);
            case LoginMethod.EMAIL:
                return this.findByEmail(identifier);
            default:
                throw_exception_1.ThrowException.badRequest("Invalid identifier");
        }
    }
    // get user by id
    async getUserById(id, req) {
        const user = (await this.checkUser(id, req));
        return user;
    }
    // update user
    async updateUser(id, updateUserDto, req) {
        const user = (await this.checkUser(id, req));
        if (updateUserDto.username) {
            const userWiththesameUsername = await this.findByUsername(updateUserDto.username.toLowerCase());
            if (userWiththesameUsername) {
                throw_exception_1.ThrowException.conflict("User with this username already exists");
            }
            user.username = updateUserDto.username;
        }
        return user.save();
    }
    // update user's active status
    async changeUserActiveStatus(adminUpdateUserStatus, req) {
        const { userId, active } = adminUpdateUserStatus;
        const user = (await this.checkUser(userId, req));
        user.active = active;
        return user.save();
    }
    // update user password
    async updateUserPassword(id, updateUserPasswordDto, req) {
        const { oldPassword, newPassword } = updateUserPasswordDto;
        const user = (await this.checkUser(id, req));
        const validPassword = await this.comparePassword(oldPassword, user.password);
        if (!validPassword) {
            throw_exception_1.ThrowException.unAuthenticated("invalid credentials");
        }
        user.password = newPassword;
        return user.save();
    }
    // delete user
    async deleteUser(deleteUserDto, req) {
        const { userId } = deleteUserDto;
        const user = (await this.checkUser(userId, req));
        return user.remove();
    }
}
exports.UserService = UserService;
