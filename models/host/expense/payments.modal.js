import mongoose from "mongoose";

const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    eventId: {
      type: String,
      ref: "Event",
      required: true,
      index: true,
    },
    expenseId: {
      type: String,
      ref: "Expense",
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    vendorId: {
      type: String,
      required: true,
    },

    paymentCode: {
      type: String,
      unique: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentType: {
      type: String,
      enum: ["Advance", "Partial", "Final", "Refund"],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Card", "Cheque"],
      required: true,
    },

    transactionReference: String,

    paymentDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Cancelled"],
      default: "Completed",
    },

    attachments: [
      {
        fileUrl: String,
      },
    ],

    notes: String,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index({ expenseId: 1 });

const PAYMENTS = model("Payment", paymentSchema);

export default PAYMENTS;
