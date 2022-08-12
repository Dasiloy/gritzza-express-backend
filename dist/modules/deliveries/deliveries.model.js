"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliverySchema = exports.DeliveryStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["READY"] = "READY";
    DeliveryStatus["ON_THE_WAY"] = "ON_THE_WAY";
    DeliveryStatus["DELIVERED"] = "DELIVERED";
    DeliveryStatus["CANCELLED"] = "CANCELLED";
})(DeliveryStatus = exports.DeliveryStatus || (exports.DeliveryStatus = {}));
const DELIVERY_SCHEMA = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: "ORDER",
        required: [true, "Order is required"],
    },
    agent: {
        type: Schema.Types.ObjectId,
        ref: "USER",
        required: [true, "Agent is required"],
    },
    status: {
        type: String,
        enum: {
            values: [
                DeliveryStatus.READY,
                DeliveryStatus.ON_THE_WAY,
                DeliveryStatus.DELIVERED,
            ],
            message: "Status is required",
        },
        required: [true, "Status is required"],
        default: DeliveryStatus.READY,
    },
}, {
    timestamps: true,
});
exports.deliverySchema = model("DELIVERY", DELIVERY_SCHEMA);
