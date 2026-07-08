import mongoose, { Schema } from "mongoose";

const InvitationSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    InviteId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["local", "relative", "friend", "friend of friend"],
      required: true,
    },
    chiefGuest: {
      type: Boolean,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: ["invited", "yet to invite"],
      default: "yet to invite",
    },
    acceptance: {
      type: String,
      enum: ["accepted", "not accepted", "pending"],
      default: "pending",
    },
    receiverNote: {
      type: String,
    },
  },
  { timestamps: true },
);

const INVITATION =
  mongoose.models.Invitation || mongoose.model("Invitation", InvitationSchema);

export default INVITATION;
