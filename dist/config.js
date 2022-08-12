"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    sendgrid: {
        apiKey: process.env.SEND_GRID_API_KEY,
        emailClient: process.env.EMAIL_CLIENT,
    },
};
