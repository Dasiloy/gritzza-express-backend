"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCreator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
class TokenCreator {
    constructor(user) {
        this.token = null;
        this.email = user.email;
        this.secretKey = process.env.JWT_SECRET;
        this.tokenUser = this.createTokenUser(user);
    }
    // create a new instance of the class
    static getInstance(user) {
        TokenCreator.instance = new TokenCreator(user);
        return TokenCreator.instance;
    }
    // token getter
    getToken() {
        return this.token;
    }
    // email getter
    getEmail() {
        return this.email;
    }
    // token user getter
    getTokenUser() {
        return this.tokenUser;
    }
    // create a token user
    createTokenUser(user) {
        return {
            id: user._id.toString(),
            username: user.username,
            role: user.role,
        };
    }
    // create a token
    createToken() {
        const token = jsonwebtoken_1.default.sign(this.tokenUser, this.secretKey);
        this.token = token;
        return token;
    }
    // verify token
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.secretKey);
    }
    // create a hashed string
    createHash() {
        const token = crypto_1.default.randomBytes(32).toString("hex");
        return crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
    }
}
exports.TokenCreator = TokenCreator;
