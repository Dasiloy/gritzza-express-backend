"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketModel = exports.TicketStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["PENDING"] = "pending";
    TicketStatus["RESOLVED"] = "resolved";
    TicketStatus["CANCELLED"] = "cancelled";
})(TicketStatus = exports.TicketStatus || (exports.TicketStatus = {}));
const TICKET_SCHEMA = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        minlength: 5,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
        minlength: 10,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: [
                TicketStatus.PENDING,
                TicketStatus.RESOLVED,
                TicketStatus.CANCELLED,
            ],
            message: "Status is invalid",
        },
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "USER",
        required: true,
    },
}, {
    timestamps: true,
});
exports.ticketModel = mongoose_1.default.model("TICKET", TICKET_SCHEMA);
