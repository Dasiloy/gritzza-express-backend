"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const throw_exception_1 = require("../../exceptions/throw-exception");
const auth_service_1 = require("./auth.service");
// handler for POST /api/auth/signup
async function signUp(req, res) {
    const createuserDto = req.body;
    const authService = new auth_service_1.AuthService();
    const { user } = await authService.signUp(createuserDto);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        email: user.email,
        username: user.username,
    });
}
// handler for POST /api/auth/signin
async function signIn(req, res) {
    const loginUserDto = req.body;
    const authService = new auth_service_1.AuthService();
    const { token, tokenUser } = await authService.signIn(loginUserDto);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        token,
        user: tokenUser,
    });
}
// handler for POST /api/auth/verify
async function verifyUser(req, res) {
    const authService = new auth_service_1.AuthService();
    if (!req.body.token || !req.body.email) {
        throw_exception_1.ThrowException.badRequest("Token and email are required");
    }
    await authService.verifyUser(req.body.token, req.body.email);
    res.status(http_status_codes_1.StatusCodes.OK).send();
}
// handler for POST /api/auth/resend-verification-token
async function resendVerificationToken(req, res) {
    const authService = new auth_service_1.AuthService();
    await authService.resendVerificationToken(req.body.email);
    res.status(http_status_codes_1.StatusCodes.OK).send();
}
// handler for POST /api/auth/forgot-password
async function forgotPassword(req, res) {
    const authService = new auth_service_1.AuthService();
    await authService.forgotPassword(req.body.email);
    res.status(http_status_codes_1.StatusCodes.OK).send();
}
//handler for POST resend password reset token
async function resendPasswordResetToken(req, res) {
    const authService = new auth_service_1.AuthService();
    await authService.resendPasswordResetToken(req.body.email);
    res.status(http_status_codes_1.StatusCodes.OK).send();
}
// handler for POST /api/auth/reset-password
async function resetPassword(req, res) {
    const { token, email, password } = req.body;
    const authService = new auth_service_1.AuthService();
    await authService.resetPassword(token, email, password);
    res.status(http_status_codes_1.StatusCodes.OK).send();
}
exports.default = {
    signUp,
    signIn,
    verifyUser,
    resendVerificationToken,
    forgotPassword,
    resendPasswordResetToken,
    resetPassword,
};
