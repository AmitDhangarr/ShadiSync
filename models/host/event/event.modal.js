import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
});

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: "main" },
});

const EventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    eventVenue: {
      type: String,
      required: true,
      trim: true,
    },

    guests: {
      type: [GuestSchema],
      required: true,
      default: [],
    },

    foodItems: {
      type: [FoodItemSchema],
      required: true,
      default: [],
    },

    photography: {
      included: { type: Boolean, default: false },
      vendorName: { type: String },
      totalAmount: { type: Number },
      paymentStatus: { type: String, enum: ["Unpaid", "Partial", "Paid"] },
    },

    decoration: {
      included: { type: Boolean, default: false },
      vendorName: { type: String },
      totalAmount: { type: Number },
      paymentStatus: { type: String, enum: ["Unpaid", "Partial", "Paid"] },
    },

    budget: {
      type: Number,
      required: true,
    },

    budgetSummary: {
      totalAllocated: { type: Number, default: 0 },
      totalConsumed: { type: Number, default: 0 },
      totalRemaining: { type: Number, default: 0 },
      isOverBudget: { type: Boolean, default: false },
    },

    expenseSummary: {
      totalEstimated: { type: Number, default: 0 },
      totalActual: { type: Number, default: 0 },
      totalPaid: { type: Number, default: 0 },
      totalRemaining: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 },
      totalDiscount: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
      required: true,
    },
  },
  { timestamps: true },
);

const EVENT = mongoose.model("Event", EventSchema);

export default EVENT;
