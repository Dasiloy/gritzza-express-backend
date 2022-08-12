import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { userModel } from "../modules/users/users.model";
import { TokenUser } from "./token/payload-token.service";
import dotenv from "dotenv";

dotenv.config();

const passportOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
  new Strategy(passportOptions, async function (
    jwtPayload: TokenUser,
    done
  ) {
    try {
      const user = await userModel.findById(jwtPayload?.id);
      return done(null, user,{message: "Success"});
    } catch (err) {
      console.log(err);
      return done(err, null, { message: "Unauthenticated" });
    }
  })
);
