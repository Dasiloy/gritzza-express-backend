import { Router } from "express";
import userController from "./user.controller";
import passport from "passport";
import { userPermissions } from "../../middleware/user-permissions";
import { UserRole } from "./users.model";

const router = Router();

// show current user route
router.get(
  "/show",
  passport.authenticate("jwt", { session: false }),
  userController.getUserFromQuery
);

// show all users route -- admin only
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN),
  userController.getAllUsers
);

// create user route -- admin only
router.post(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN),
  userController.createUser
);

// delete user  -- admin only
router.delete(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN),
  userController.deleteUserByAdmin
);

// change user active status route -- admin only
router.patch(
  "/admin/status",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN),
  userController.changeUserStatus
);

// search users route -- admin only
router.get(
  "/admin/search",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN),
  userController.getUsers
);

// show user by id route
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userController.getUserById
);

// update user route
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userController.updateUser
);

// update user password route
router.patch(
  "/:id/password",
  passport.authenticate("jwt", { session: false }),
  userController.updateUserPassword
);

// delete user route
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN),
  userController.deleteUser
);

export default router;
