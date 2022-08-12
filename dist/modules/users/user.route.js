"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const passport_1 = __importDefault(require("passport"));
const user_permissions_1 = require("../../middleware/user-permissions");
const users_model_1 = require("./users.model");
const router = (0, express_1.Router)();
// show current user route
router.get("/show", passport_1.default.authenticate("jwt", { session: false }), user_controller_1.default.getUserFromQuery);
// show all users route -- admin only
router.get("/admin", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN), user_controller_1.default.getAllUsers);
// create user route -- admin only
router.post("/admin", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN), user_controller_1.default.createUser);
// delete user  -- admin only
router.delete("/admin", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN), user_controller_1.default.deleteUserByAdmin);
// change user active status route -- admin only
router.patch("/admin/status", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN), user_controller_1.default.changeUserStatus);
// search users route -- admin only
router.get("/admin/search", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN), user_controller_1.default.getUsers);
// show user by id route
router.get("/:id", passport_1.default.authenticate("jwt", { session: false }), user_controller_1.default.getUserById);
// update user route
router.patch("/:id", passport_1.default.authenticate("jwt", { session: false }), user_controller_1.default.updateUser);
// update user password route
router.patch("/:id/password", passport_1.default.authenticate("jwt", { session: false }), user_controller_1.default.updateUserPassword);
// delete user route
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN), user_controller_1.default.deleteUser);
exports.default = router;
