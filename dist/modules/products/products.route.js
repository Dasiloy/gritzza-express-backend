"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const user_permissions_1 = require("../../middleware/user-permissions");
const users_model_1 = require("../users/users.model");
const router = (0, express_1.Router)();
// create a new product ===> only for merchants
router.post("/", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.MERCHANT));
// get all products ===> everyone can see this
router.get("/");
// upload a product image ===> only for merchants
router.post("/uploads", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.MERCHANT));
// get a product by id ===> everyone can see this
router.get("/:id");
// update a product ===> only for merchants
router.patch("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.MERCHANT));
// delete a product ===> only for admins and merchants
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN, users_model_1.UserRole.MERCHANT));
// create a new review ===> only for customers
router.post("/:id/reviews", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.USER));
// get product reviews ===> everyone can see this
router.get("/:id/reviews");
// get a single review ===> everyone can see this
router.get("/:id/reviews/:reviewId");
// update a review ===> only for customers
router.patch("/:id/reviews/:reviewId", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.USER));
exports.default = router;
