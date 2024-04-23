import jwt from "jsonwebtoken";
import { jwtSecret } from "../secret/secret.js";
import User from "../models/userModel.js";

export const isLogin = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      throw Error("User not found, Please Login");
    }
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw Error("User not found!");
    }
    req.user = user;

    return next();
  } catch (error) {
    next(error);
  }
};
