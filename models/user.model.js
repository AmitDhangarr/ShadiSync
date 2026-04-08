import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ["host", "guest"],
        message: "Role must be either host or guest",
      },
      required: true,
    },
    securityQuestion: {
      type: String,
      required: true,
      trim: true,
    },
    securityAnswer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const USER = mongoose.model("User", userSchema);
