import mongoose from "mongoose";

const { Schema, model } = mongoose;

export interface ICartItem extends mongoose.Document { 
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    name: number;
    image: string;
}

const CART_ITEM_SCHEMA = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
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

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
  DELIVERED = "delivered",
}

export interface IOrder extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  total: number;
  tax: number;
  deliveryFee: number;
  subtotal: number;
  cart: Array<ICartItem>;
  paymentIntentId: string;
  status: OrderStatus;
}

const ORDER_SCHEMA = new Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export const orderModel = model<IOrder>("ORDER", ORDER_SCHEMA);
