import { Router } from "express";
import passport from "passport";
import { userPermissions } from "../../middleware/user-permissions";
import { UserRole } from "../users/users.model";
import storeController from "./stores.controller";

const router = Router();

// create store -- only for admin and merchant
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.MERCHANT),
  storeController.createStore
);

// get all stores -- everyone can see stores
router.get("/", storeController.getAllStores);

// search stores -- only authenticated user can search stores
router.get(
  "/search",
  passport.authenticate("jwt", {
    session: false,
  }),
  storeController.searchStores
);

// get store by id -- everyone can see store
router.get("/:id", storeController.getStoreById);

// update store -- only for admin and merchant
router.patch(
  "/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  storeController.updateStore
);

// delete store -- only for admin
router.delete(
  "/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  userPermissions(UserRole.ADMIN),
  storeController.deleteStore
);

// like store -- only for user
router.post(
  "/:id/like",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.USER),
  storeController.addLike
);

// unlike store -- only for user
router.delete(
  "/:id/like",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.USER),
  storeController.removeLike
);

// follow store -- only for user
router.post(
  "/:id/follow",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.USER),
  storeController.addFollower
);

// unhallow store -- only for user
router.delete(
  "/:id/follow",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.USER),
  storeController.removeFollower
);

// change store status -- only for admin
router.patch(
  "/:id/status",
  passport.authenticate("jwt", {
    session: false,
  }),
  userPermissions(UserRole.ADMIN),
  storeController.changeStoreStatus
);

export default router;
