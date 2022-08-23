"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationTokenService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const throw_exception_1 = require("../../../exceptions/throw-exception");
const user_service_1 = require("../../../modules/users/user.service");
const verificationToken_model_1 = require("./verificationToken.model");
class verificationTokenService {
    constructor() {
        this.verificationTokenModel = verificationToken_model_1.verificationTokenModel;
        this.userService = new user_service_1.UserService();
        this.TOKEN_EXPIRATION = 60 * 1000 * 10; // 10 minutes
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
        const verificationToken = await this.verificationTokenModel.findOne({
            token,
            user: userId,
        });
        if (!verificationToken) {
            throw_exception_1.ThrowException.badRequest("Invalid token");
        }
        else if (Date.now() >
            new Date(verificationToken === null || verificationToken === void 0 ? void 0 : verificationToken.expiresAt).getTime()) {
            throw_exception_1.ThrowException.badRequest("Token expired");
        }
        return verificationToken;
    }
    // create verification token
    async createToken(userId) {
        const token = this.createHash();
        return this.verificationTokenModel.create({
            token,
            user: userId,
            expiresAt: new Date(Date.now() + this.TOKEN_EXPIRATION),
        });
    }
    // resend token
    async resendToken(userId) {
        const existingToken = await this.verificationTokenModel.findOne({
            user: userId,
        });
        if (existingToken) {
            if (Date.now() >
                new Date(existingToken === null || existingToken === void 0 ? void 0 : existingToken.expiresAt).getTime()) {
                await existingToken.remove();
            }
            else {
                return existingToken;
            }
        }
        return this.createToken(userId);
    }
    // validate token
    async validateToken(token, email) {
        // find user with the email
        const user = await this.userService.findByEmailWithNoVerification(email);
        if (!user) {
            throw_exception_1.ThrowException.badRequest("Invalid credentials");
        }
        if (user === null || user === void 0 ? void 0 : user.verified) {
            throw_exception_1.ThrowException.badRequest("User already verified");
        }
        // find verification token with the token and user
        const verificationToken = await this.findToken(token, user === null || user === void 0 ? void 0 : user._id);
        // update user verification to true
        if (user) {
            user.verified = true;
            await user.save();
        }
        if (verificationToken) {
            await verificationToken.remove();
        }
    }
}
exports.verificationTokenService = verificationTokenService;
