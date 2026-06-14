"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_schema_1 = require("./user.schema");
const user_controller_1 = __importDefault(require("./user.controller"));
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.get("/user", (0, validate_middleware_1.validate)((req, res) => user_controller_1.default.getUsers(req, res), user_schema_1.userSchema.list));
router.get("/user/:userId", (0, validate_middleware_1.validate)((req, res) => user_controller_1.default.getUser(req, res), user_schema_1.userSchema.get));
router.delete("/user/me", (req, res) => user_controller_1.default.deleteMe(req, res));
router.delete("/user/:userId", (0, validate_middleware_1.validate)((req, res) => user_controller_1.default.delete(req, res), user_schema_1.userSchema.delete));
exports.default = router;
