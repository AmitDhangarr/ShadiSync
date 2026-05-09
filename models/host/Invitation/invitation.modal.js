import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema(
  {
    InviteId: {
      type: String,
      required: true,
      unique: true,
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
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["invited", "not invited"],
      default: "not invited",
    },

    acceptance: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const INVITATION = mongoose.model("Invitation", InvitationSchema);

export default INVITATION;
