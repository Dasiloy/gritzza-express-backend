import { Router } from "express";
import passport from "passport";
import { userPermissions } from "../../middleware/user-permissions";
import { UserRole } from "../users/users.model";

const router = Router();

// create a new ticket ===> only users and merchant
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.USER, UserRole.MERCHANT)
);

// get all tickets ===> only admin can do this
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN)
);

// get a ticket by id ===> only admin or the complainer can do this
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN, UserRole.USER)
);

// update a ticket ===> only admin or the complainer can do this
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN, UserRole.USER)
);

// delete a ticket ===> only admin can do this
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN)
);

// change ticket status ===> only admin can do this
router.patch(
  "/:id/status",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN)
);
