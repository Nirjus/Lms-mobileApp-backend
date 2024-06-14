import cloudinary from "cloudinary";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { backendUrl, jwtSecret } from "../secret/secret.js";
import { getDataUri } from "../utils/fileHandler.js";
import { sendEmail } from "../config/Nodemailer.js";
import Course from "../models/courseModel.js";
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
    const token = jwt.sign({ name, password, email }, jwtSecret, {
      expiresIn: "10m",
    });
    const emailData = {
      email,
      subject: "Account Activation Email ",
      html: `
         <div style="background-color: #f0f8ff; padding: 40px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #cce7ff;">
      <h2 style="color: #003366; text-align: center;">Hello, ${name}!</h2>
      <p style="color: #003366; font-size: 16px; text-align: center;">Thank you for registering with us. Please click the button below to activate your account:</p>
      <div style="text-align: center;">
        <a href="${backendUrl}/api/v1/user/verify/${token}" style="text-decoration: none;">
          <button style="
            background-color: #28a745; 
            color: white; 
            padding: 15px 30px; 
            border: none; 
            border-radius: 5px; 
            font-size: 18px; 
            cursor: pointer; 
            transition: background-color 0.3s ease;
          " 
          onmouseover="this.style.backgroundColor='#218838'"
          onmouseout="this.style.backgroundColor='#28a745'">
            Activate Account
          </button>
        </a>
      </div>
      <p style="color: #003366; font-size: 14px; text-align: center; margin-top: 20px;">If you did not request this, please ignore this email or contact our support team.</p>
      <p style="color: #003366; font-size: 14px; text-align: center; margin-top: 20px;">Best regards,<br>ELearner</p>
    </div>
      `,
    };
    await sendEmail(emailData);

    return res.status(201).json({
      success: true,
      message: `Please visit your email ${email} for account activation`,
    });
  } catch (error) {
    next(error);
  }
};
export const processVerify = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      throw Error("Token not found");
    }
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded) {
      throw Error("Unable to register user");
    }
    const userExists = await User.exists({ email: decoded.email });

    if (userExists) {
      throw Error("User already exists with this email");
    }
    await User.create({
      email: decoded.email,
      password: decoded.password,
      name: decoded.name,
    });

    return res.status(200).send(`
      <div style=" text-align: center; margin: 50px;">
         <h1 style=" color: green;"> Success</h1>
         <p>Your account is registerd successfully</p>
      </div>
      `);
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

export const userUpdate = async (req, res, next) => {
  try {
    const user = req.user;
    const { name } = req.body;

    const getUser = await User.findById(user.id);
    const courses = await Course.find({});
    const file = getDataUri(req.file);
    if (!getUser) {
      throw Error("User not found");
    }

    if (name) {
      getUser.name = name;
    }
    if (req.file) {
      if (getUser.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }
      const myCloude = await cloudinary.v2.uploader.upload(file.content, {
        folder: "LMS-React-native",
      });
      getUser.avatar = {
        public_id: myCloude.public_id,
        url: myCloude.secure_url,
      };
      courses.forEach((course) => {
        course.reviews.forEach((review) => {
          if (review.userId?.toString() === getUser?._id?.toString()) {
            (review.avatar = getUser.avatar?.url), (review.name = getUser.name);
          }
        });
      });
      // Save the updated courses
      for (const course of courses) {
        await course.save();
      }
    }
    await getUser.save();

    return res.status(201).json({
      success: true,
      message: "User updated syccessfully",
      user: getUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = req.user;

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword) {
      throw Error("Please provide Old Password");
    }
    if (!newPassword) {
      throw Error("Plase provide New Password");
    }
    const getUser = await User.findById(user?.id).select("+password");

    const comparePassword = await bcryptjs.compare(
      oldPassword,
      getUser?.password
    );

    if (!comparePassword) {
      throw Error("Old Password not match");
    }
    getUser.password = newPassword;

    await getUser.save();

    return res.status(201).json({
      success: true,
      message: "Password Updated",
      user: getUser,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      throw Error("Please provide email and password");
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      throw Error("User is not exists with this email");
    }
    const token = jwt.sign({ email, newPassword }, jwtSecret, {
      expiresIn: "5m",
    });

    const emailData = {
      email,
      subject: "Forgot Password ",
      html: `
        <div style="background-color: #e6f7ff; padding: 40px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #003366;">Hello ${user?.name}</h2>
      <p style="color: #003366;">Please click the button below to reset your password:</p>
      <a href="${backendUrl}/api/v1/user/reset-password/${token}" style="text-decoration: none;">
        <button style="background-color: #0059b3; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
          Reset Password
        </button>
      </a>
      <p style="color: #003366;">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
    </div>
      `,
    };
    await sendEmail(emailData);
    return res.status(201).json({
      success: true,
      message: `Check your email: ${user?.email} to reset your password`,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyForgetPasswordEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).send(`
        <div style="text-align: center; margin: 50px;">
          <h1 style="color: red;">Error</h1>
          <p>Token not found</p>
        </div>
        `);
    }
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded) {
      return res.status(400).send(`
        <div style="text-align: center; margin: 50px;">
          <h1 style="color: red;">Error</h1>
          <p>Token expired</p>
        </div>
      `);
    }
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).send(`
        <div style="text-align: center; margin: 50px;">
          <h1 style="color: red;">Error</h1>
          <p>User not exists with this email</p>
        </div>
      `);
    }
    user.password = decoded.newPassword;

    await user.save();

    return res.status(200).send(`
          <div style="text-align: center; margin: 50px;">
          <h1 style="color: green;">Success</h1>
          <p>Password successfully reset</p>
        </div>
      `);
  } catch (error) {
    next(error);
  }
};
export const getUsersByPoint = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ point: -1 }).limit(100);

    return res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};
