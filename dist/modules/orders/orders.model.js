"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = exports.OrderStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const CART_ITEM_SCHEMA = new Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "PRODUCT",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PAID"] = "paid";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["DELIVERED"] = "delivered";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
const ORDER_SCHEMA = new Schema({
    tax: {
        type: Number,
        required: true,
    },
    deliveryFee: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: [true, "Please provide subtotal"],
    },
    cart: {
        type: [CART_ITEM_SCHEMA],
        required: [true, "Please provide order items"],
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "USER",
        required: [true, "Please provide user"],
    },
    total: {
        type: Number,
        required: [true, "Please provide total"],
    },
    paymentIntentId: {
        type: String,
        required: [true, "Please provide payment intent id"],
    },
    status: {
        type: String,
        enum: [
            OrderStatus.PENDING,
            OrderStatus.PAID,
            OrderStatus.CANCELLED,
            OrderStatus.DELIVERED,
        ],
        default: OrderStatus.PENDING,
    },
}, {
    timestamps: true,
});
exports.orderModel = model("ORDER", ORDER_SCHEMA);
