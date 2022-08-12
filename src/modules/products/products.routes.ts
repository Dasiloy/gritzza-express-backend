import { Router } from "express";
import passport from "passport";
import { userPermissions } from "../../middleware/user-permissions";
import { UserRole } from "../users/users.model";

const router = Router();

// create a new product ===> only for merchants
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.MERCHANT)
);

// get all products ===> everyone can see this
router.get("/");

// upload a product image ===> only for merchants
router.post(
  "/uploads",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.MERCHANT)
);

// get a product by id ===> everyone can see this
router.get("/:id");

// update a product ===> only for merchants
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.MERCHANT)
);

// delete a product ===> only for admins and merchants
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.ADMIN, UserRole.MERCHANT)
);

// create a new review ===> only for customers
router.post(
  "/:id/reviews",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.USER)
);

// get product reviews ===> everyone can see this
router.get("/:id/reviews");

// get a single review ===> everyone can see this
router.get("/:id/reviews/:reviewId");

// update a review ===> only for customers
router.patch(
  "/:id/reviews/:reviewId",
  passport.authenticate("jwt", { session: false }),
  userPermissions(UserRole.USER)
);

export default router;
