"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseAdminDto = void 0;
class UserResponseAdminDto {
    constructor(user) {
        this.email = user.email;
        this.role = user.role;
        this.username = user.username;
        this.password = user.password;
    }
}
exports.UserResponseAdminDto = UserResponseAdminDto;
