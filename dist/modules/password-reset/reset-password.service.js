"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetpasswordTokenservice = void 0;
const crypto_1 = __importDefault(require("crypto"));
const throw_exception_1 = require("../../exceptions/throw-exception");
const user_service_1 = require("../users/user.service");
const resetPasswordToken_model_1 = require("./resetPasswordToken.model");
class ResetpasswordTokenservice {
    constructor() {
        this.resetPasswordTokenModel = resetPasswordToken_model_1.resetPasswordTokenModel;
        this.userService = new user_service_1.UserService();
        this.TOKEN_EXPIRATION = 60 * 60 * 1000;
    }
    createHash() {
        const token = crypto_1.default.randomBytes(32).toString("hex");
        return crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
    }
    // find verification token with the token and user
    async findToken(token, userId) {
        const resetPasswordToken = await this.resetPasswordTokenModel.findOne({
            token,
            user: userId,
        });
        if (!resetPasswordToken) {
            throw_exception_1.ThrowException.unAuthenticated("Invalid token");
        }
        else if (Date.now() > (resetPasswordToken === null || resetPasswordToken === void 0 ? void 0 : resetPasswordToken.expiresAt)) {
            throw_exception_1.ThrowException.unAuthenticated("Token expired");
        }
        return resetPasswordToken;
    }
    // create verification token
    async createToken(userId) {
        const token = this.createHash();
        return this.resetPasswordTokenModel.create({
            token,
            userId,
            expiresAt: new Date(Date.now() + this.TOKEN_EXPIRATION),
        });
    }
    // resend token
    async resendToken(userId) {
        const existingToken = await this.resetPasswordTokenModel.findOne({
            user: userId,
        });
        if (existingToken) {
            return existingToken;
        }
        return this.createToken(userId);
    }
    // validate token
    async validateToken(token, email, password) {
        // find user with the email
        const user = await this.userService.findByEmail(email);
        // find verification token with the token and user
        const resetPasswordToken = await this.findToken(token, user === null || user === void 0 ? void 0 : user._id);
        // update user status to active
        if (user) {
            user.password = password;
            await user.save();
        }
        await (resetPasswordToken === null || resetPasswordToken === void 0 ? void 0 : resetPasswordToken.remove());
    }
}
exports.ResetpasswordTokenservice = ResetpasswordTokenservice;
