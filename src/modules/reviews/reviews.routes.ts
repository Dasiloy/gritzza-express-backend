import { Router } from "express";
import passport from "passport";
import { userPermissions } from "../../middleware/user-permissions";
import { UserRole } from "../users/users.model";

const router = Router();

// get all reviews  ===> only admin can see this
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN)
);

// remove all reviews ===> only admin can see this
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN)
);

// get single review ===> anyone can see this
router.get("/:id");

// remove single review ===> only admin can see this
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN)
);

export default router;
