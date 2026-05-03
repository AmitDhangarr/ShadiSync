import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
});

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: "main" },
});

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  service: { type: String, required: true },
  contact: { type: String },
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
    eventVenue: {
      type: String,
      required: true,
      trim: true,
    },
    guests: [GuestSchema],
    foodItems: [FoodItemSchema],
    vendors: [VendorSchema],

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
  },
  { timestamps: true },
);

const EVENT = mongoose.model("Event", EventSchema);

export default EVENT;
