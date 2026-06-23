import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";

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
        values: ["host","cohost","guest"],
        message: "Role must be either host,co-host or guest",
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const USER = mongoose.model("User", userSchema);

export default USER;