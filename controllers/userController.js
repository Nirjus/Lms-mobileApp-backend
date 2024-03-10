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
    const token = jwt.sign({ id:user._id }, jwtSecret, {
      expiresIn: "3d",
    });

  res.cookie("token",token,{
    expires: new Date(Date.now() + 3*24*60*60*1000),
    maxAge: 3*24*60*60*1000, // 3day
    httpOnly: true,
    // secure: true,  // this option is only true in production
    sameSite: "none",
  })
    // dont show the password
    const loginUser = {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(201).json({
      success: true,
      message: "Login Successfully",
      loginUser,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
        res.clearCookie("token",{
          httpOnly: true,
          // secure: true,
          sameSite: "none"
        })

        return res.status(201).json({
          success: true,
          message: "Logout successfull"
        })
  } catch (error) {
       next(error)
  }
}

export const getUser = async (req, res, next) => {
    try {
        const id = req.userId;
    
        const user = await User.findById(id);

        if(!user){
            throw Error("User not Found!");
        }

        return res.status(201).json({
            success: true,
            message: "User returned successfully",
            user
        })
    } catch (error) {
        next(error)
    }
}