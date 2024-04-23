import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { defaultAvatar } from "../secret/secret.js";
import { readImageFile } from "../config/fileReader.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      set: (v) => bcryptjs.hashSync(v, bcryptjs.genSaltSync(10)),
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    purchaseList: [
      {
        courseId: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

export default User;
