import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../secret/secret.js";

export const userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and  6 character long",
      });
    }
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      throw Error("User already present with this email");
    }
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });
    return res.status(201).json({
      success: true,
      message: "User Restration successfull",
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please provide Email",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Please provide Password",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw Error("User not found");
    }
    // match password
    const comaprePassword = await bcryptjs.compare(password, user.password);

    if (!comaprePassword) {
      throw Error("Password not matched");
    }
    //  token geneartion
    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: "3d",
    });

    user.password = undefined;

    return res.status(201).json({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    return res.status(201).json({
      success: true,
      message: "Logout successfull",
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw Error("User not Found!");
    }

    return res.status(201).json({
      success: true,
      message: "User returned successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const purchaseCourse = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { courseId } = req.body;
    if (!user) {
      throw Error("User not found");
    }
    const isCoursePurchased = user.purchaseList.find(
      (i) => i.courseId.toString() === courseId.toString()
    );

    if (isCoursePurchased) {
      throw Error("Course already purchased");
    }
    user.purchaseList.push({
      courseId: courseId,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Course Purchased successfully",
    });
  } catch (error) {
    next(error);
  }
};
