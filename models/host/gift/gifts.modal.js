import mongoose from "mongoose";

const giftRegistrySchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      ref: "Event",
      required: true,
      unique: true,
    },
    giftId: {
      type: String,
      required: true,
      unique: true,
    },
    guest_name: {
      type: String,
      required: true,
      trim: true,
    },

    guest_family: {
      type: String,
      trim: true,
    },

    mobile_number: {
      type: String,
      trim: true,
    },

    gift_type: {
      type: String,
      enum: ["Cash", "Gift Item", "Gold", "Voucher"],
      required: true,
    },

    shagun_amount: {
      type: Number,
      default: 0,
    },

    gift_item_name: {
      type: String,
      trim: true,
    },

    gift_description: {
      type: String,
      trim: true,
    },

    function_name: {
      type: String,
      enum: [
        "Engagement",
        "Haldi",
        "Mehndi",
        "Sangeet",
        "Wedding",
        "Reception",
        "Other",
      ],
    },

    payment_mode: {
      type: String,
      enum: ["Cash", "UPI", "Cheque", "Bank Transfer", "Other"],
    },

    transaction_reference: {
      type: String,
      trim: true,
    },

    envelope_number: {
      type: String,
      trim: true,
    },

    received_by: {
      type: String,
      trim: true,
    },

    received_at: {
      type: Date,
      default: Date.now,
    },

    photo: {
      type: string,
    },

    notes: {
      type: String,
      trim: true,
    },

    thank_you_sent: {
      type: Boolean,
      default: false,
    },

    return_gift_given: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const GIFT = mongoose.model("Gift", giftRegistrySchema);

export default GIFT;
