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
// create a new ticket ===> only users and merchant
router.post("/", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.USER, users_model_1.UserRole.MERCHANT));
// get all tickets ===> only admin can do this
router.get("/", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN));
// get a ticket by id ===> only admin or the complainer can do this
router.get("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN, users_model_1.UserRole.USER));
// update a ticket ===> only admin or the complainer can do this
router.patch("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN, users_model_1.UserRole.USER));
// delete a ticket ===> only admin can do this
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN));
// change ticket status ===> only admin can do this
router.patch("/:id/status", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN));
