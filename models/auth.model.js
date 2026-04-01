import { Schema } from "mongoose";
import { Model } from "mongoose";
import { trim } from "validator";

const Auth = new Schema({
  email: {
    Type: String,
    required: true,
  },
  password: {
    Type: String,
    required: true,
  },
  role: {
    Type: String,
    required: true,
  },
});

export const AUTH = new Model.create("auth", Auth);
