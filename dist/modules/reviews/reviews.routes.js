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
// get all reviews  ===> only admin can see this
router.get("/", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN));
// remove all reviews ===> only admin can see this
router.delete("/", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN));
// get single review ===> anyone can see this
router.get("/:id");
// remove single review ===> only admin can see this
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, user_permissions_1.userPermissions)(users_model_1.UserRole.ADMIN));
exports.default = router;
