import mongoose from "mongoose";

const { Schema, model } = mongoose;

export enum DeliveryStatus {
  READY = "READY",
  ON_THE_WAY = "ON_THE_WAY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface IDelivery extends mongoose.Document {
  order: mongoose.Schema.Types.ObjectId;
  agent: mongoose.Schema.Types.ObjectId;
  status: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}

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

export const deliverySchema = model<IDelivery>("DELIVERY", DELIVERY_SCHEMA);
