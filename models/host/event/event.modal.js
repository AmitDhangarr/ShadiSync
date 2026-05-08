import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
});

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: "main" },
});

const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    enum: [
      "advance",
      "partial",
      "settlement",
      "refund",
      "extra_charge",
      "discount",
    ],
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    required: true,
  },
});

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  service: {
    type: String,
    required: true,
  },

  contact: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  payments: [PaymentSchema],
});

const EventSchema = new mongoose.Schema(
  {
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

    vendors: {
      type: [VendorSchema],
      required: true,
      default: [],
    },

    photography: {
      type: Boolean,
      required: true,
    },
    decoration: {
      type: Boolean,
      required: true,
    },
    budget: {
      type: Number,
      min: 1000,
      required: true,
    },
    expense: {
      type: Number,
      required: true,
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
