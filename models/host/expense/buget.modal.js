import mongoose from "mongoose";

const { Schema, model } = mongoose;

const budgetSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subCategory: {
      type: String,
      trim: true,
    },

    allocatedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    revisedAmount: {
      type: Number,
      default: 0,
    },

    consumedAmount: {
      type: Number,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Draft", "Approved", "Closed"],
      default: "Draft",
    },

    notes: String,

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: Date,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    budgetCode: {
      type: String,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    budgetType: {
      type: String,
      enum: ["Operational", "Vendor", "Marketing", "Emergency", "Miscellaneous"],
      default: "Operational",
    },

    functionId: {
      type: Schema.Types.ObjectId,
      ref: "EventFunction",
    },

    startDate: Date,

    endDate: Date,

    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ category: 1 });
budgetSchema.index({ status: 1 });

const BUDGET = model("budget", budgetSchema);

export default BUDGET;