import mongoose from "mongoose";

export enum TicketStatus {
  PENDING = "pending",
  RESOLVED = "resolved",
  CANCELLED = "cancelled",
}

export interface ITicket extends mongoose.Document {
  title: string;
  description: string;
  status: TicketStatus;
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TICKET_SCHEMA = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ticketModel = mongoose.model<ITicket>(
  "TICKET",
  TICKET_SCHEMA
);
