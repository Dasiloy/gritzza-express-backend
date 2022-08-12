"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_service_1 = require("../users/user.service");
const email_service_1 = require("../../services/email/email.service");
const verification_token_service_1 = require("../../services/token/verification/verification-token.service");
const throw_exception_1 = require("../../exceptions/throw-exception");
const reset_password_service_1 = require("../../services/token/password-reset/reset-password.service");
const payload_token_service_1 = require("../../services/token/payload-token.service");
class AuthService {
    constructor() {
        this.userService = new user_service_1.UserService();
        this.emailService = new email_service_1.EmailService();
        this.verificationTokenService = new verification_token_service_1.verificationTokenService();
        this.resetPasswordService = new reset_password_service_1.ResetpasswordTokenservice();
    }
    async comparePassword(password, hashedPassword) {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
    // sign up user
    async signUp(createuserDto) {
        // create user
        const user = await this.userService.createUserBySignUp(createuserDto);
        // create a new verification token
        const verificationToken = await this.verificationTokenService.createToken(user._id);
        // trigger email verification
        await this.emailService.sendVerificationEmail({
            email: user.email,
            token: verificationToken.token,
            name: user.username,
        });
        return {
            user,
            token: verificationToken.token,
        };
    }
    // verify user
    async verifyUser(token, email) {
        if (!email || !token) {
            throw_exception_1.ThrowException.badRequest("email and token are required");
        }
        return this.verificationTokenService.validateToken(token, email);
    }
    // resend verification token
    async resendVerificationToken(email) {
        if (!email) {
            throw_exception_1.ThrowException.badRequest("email is required");
        }
        const user = await this.userService.findByEmail(email); // find user  by mail
        if (user) {
            if (user.verified) {
                throw_exception_1.ThrowException.badRequest("User already verified");
            }
            const resendToken = await this.verificationTokenService.resendToken(user === null || user === void 0 ? void 0 : user.id);
            // trigger email verification
            await this.emailService.sendVerificationEmail({
                email: user.email,
                token: resendToken.token,
                name: user.username,
            });
            return resendToken.token;
        }
    }
    // sign in user
    async signIn(createuserDto) {
        let method;
        let identifier;
        if (!createuserDto.username && !createuserDto.email) {
            throw_exception_1.ThrowException.badRequest("Username or email is required");
        }
        if (createuserDto.username) {
            method = user_service_1.LoginMethod.USERNAME;
            identifier = createuserDto.username;
        }
        else if (createuserDto.email) {
            method = user_service_1.LoginMethod.EMAIL;
            identifier = createuserDto.email;
        }
        else {
            method = user_service_1.LoginMethod.INVALID;
            identifier = "";
        }
        // find user by identifier
        const user = await this.userService.findByIdentifier(identifier, method);
        // if user not found
        if (!user) {
            throw_exception_1.ThrowException.unAuthenticated("invalid credentials");
        }
        if (!(user === null || user === void 0 ? void 0 : user.verified)) {
            throw_exception_1.ThrowException.unAuthenticated("User not verified");
        }
        // if user is not active
        if (!(user === null || user === void 0 ? void 0 : user.active)) {
            throw_exception_1.ThrowException.unAuthenticated("Your account has been restricted");
        }
        //compare password
        const isValid = await this.comparePassword(createuserDto.password, user === null || user === void 0 ? void 0 : user.password);
        if (!isValid) {
            throw_exception_1.ThrowException.unAuthenticated("invalid credentials");
        }
        const tokenInstance = payload_token_service_1.TokenCreator.getInstance(user); // create a token instance
        const token = tokenInstance.createToken(); // gets the users token
        const tokenUser = tokenInstance.getTokenUser(); // gets the users token
        return {
            token,
            tokenUser,
        };
    }
    // forgot password
    async forgotPassword(email) {
        if (!email) {
            throw_exception_1.ThrowException.badRequest("email is required");
        }
        const user = await this.userService.findByEmail(email); // find user  by mail
        const passwordResetToken = await this.resetPasswordService.createToken(user === null || user === void 0 ? void 0 : user.id);
        if (user) {
            // trigger email verification
            await this.emailService.sendPasswordResetEmail({
                email: user.email,
                token: passwordResetToken.token,
                name: user.username,
            });
            return passwordResetToken.token;
        }
    }
    // resend password reset token
    async resendPasswordResetToken(email) {
        if (!email) {
            throw_exception_1.ThrowException.badRequest("email is required");
        }
        const user = await this.userService.findByEmail(email); // find user  by mail
        const resendToken = await this.resetPasswordService.resendToken(user === null || user === void 0 ? void 0 : user.id); // find or create a new reset token
        // trigger email verification
        await this.emailService.sendPasswordResetEmail({
            email: user === null || user === void 0 ? void 0 : user.email,
            token: resendToken === null || resendToken === void 0 ? void 0 : resendToken.token,
            name: user === null || user === void 0 ? void 0 : user.username,
        });
        return resendToken.token;
    }
    // reset password
    async resetPassword(token, email, password) {
        return this.resetPasswordService.validateToken(token, email, password);
    }
}
exports.AuthService = AuthService;
