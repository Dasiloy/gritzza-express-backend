"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const custom_exception_1 = require("../exceptions/custom-exception");
const router = (0, express_1.Router)();
const newPromise = () => new Promise((resolve, reject) => {
    const number = 0;
    if (number > 0) {
        resolve(number);
    }
    else {
        reject("failed");
    }
});
router.get("/showMe", async (req, res, next) => {
    try {
        await newPromise();
        res.status(200).json({
            message: "success",
        });
    }
    catch (error) {
        throw new custom_exception_1.CustomException("failed", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
});
exports.default = router;
