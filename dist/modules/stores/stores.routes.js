"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const user_permissions_1 = require("../../middleware/user-permissions");
const users_model_1 = require("../users/users.model");
const stores_controller_1 = __importDefault(require("./stores.controller"));
const router = (0, express_1.Router)();
// create store -- only for admin and merchant
router.post("/", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.MERCHANT), stores_controller_1.default.createStore);
// get all stores -- everyone can see stores
router.get("/", stores_controller_1.default.getAllStores);
// search stores -- only authenticated user can search stores
router.get("/search", passport_1.default.authenticate("jwt", {
    session: false,
}), stores_controller_1.default.searchStores);
// get store by id -- everyone can see store
router.get("/:id", stores_controller_1.default.getStoreById);
// update store -- only for admin and merchant
router.patch("/:id", passport_1.default.authenticate("jwt", {
    session: false,
}), stores_controller_1.default.updateStore);
// delete store -- only for admin
router.delete("/:id", passport_1.default.authenticate("jwt", {
    session: false,
}), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN), stores_controller_1.default.deleteStore);
// like store -- only for user
router.post("/:id/like", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.USER), stores_controller_1.default.addLike);
// unlike store -- only for user
router.delete("/:id/like", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.USER), stores_controller_1.default.removeLike);
// follow store -- only for user
router.post("/:id/follow", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.USER), stores_controller_1.default.addFollower);
// unhallow store -- only for user
router.delete("/:id/follow", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.USER), stores_controller_1.default.removeFollower);
// change store status -- only for admin
router.patch("/:id/status", passport_1.default.authenticate("jwt", {
    session: false,
}), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN), stores_controller_1.default.changeStoreStatus);
exports.default = router;
