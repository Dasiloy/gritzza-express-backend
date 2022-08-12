"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const users_model_1 = require("../modules/users/users.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passportOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
passport_1.default.use(new passport_jwt_1.Strategy(passportOptions, async function (jwtPayload, done) {
    try {
        const user = await users_model_1.userModel.findById(jwtPayload === null || jwtPayload === void 0 ? void 0 : jwtPayload.id);
        return done(null, user, { message: "Success" });
    }
    catch (err) {
        console.log(err);
        return done(err, null, { message: "Unauthenticated" });
    }
}));
