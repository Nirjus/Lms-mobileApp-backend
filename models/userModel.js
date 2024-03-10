import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { defaultAvatar } from "../secret/secret.js";
import { readImageFile } from "../config/fileReader.js";

const base64String = readImageFile(defaultAvatar);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    min:[6, "Password must be 6 character long"],
    max: [64, "Excide the limit of password length"],
    set: (v) => bcryptjs.hashSync(v, bcryptjs.genSaltSync(10)),
  },
  avatar:{
    type: String,
    default: base64String
  },
   role:{
    type: String,
    default: "user"
   }

},{timestamps: true});


const User = mongoose.model("Users", userSchema);

export default User