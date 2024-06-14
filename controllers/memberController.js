import { sendEmail } from "../config/Nodemailer.js";
import MemberShip from "../models/memberShipmOdel.js";
import User from "../models/userModel.js";
import { calculateEndDate } from "../utils/timeHandler.js";

export const checkMember = async (req, res, next) => {
  try {
    const user = req.user;
    const isMember = await MemberShip.findOne({
      email: user?.email,
      Active: true,
    });
    if (!isMember) {
      return res.status(200).json({
        success: true,
        isMember: false,
      });
    }
    if (isMember.subscription.endDate <= new Date()) {
      isMember.Active = false;
      await isMember.save();
    }
    return res.status(200).json({
      success: true,
      isMember: isMember.Active,
    });
  } catch (error) {
    next(error);
  }
};

export const createMemberShip = async (req, res, next) => {
  try {
    const { paymentId, price, subscriptionPeriod, subscriptionId } = req.body;

    const user = req.user;
    const isMember = await MemberShip.exists({
      email: user?.email,
    });
    if (!paymentId || !price || !subscriptionPeriod) {
      throw Error("Please provide all information");
    }

    const endDate = calculateEndDate(subscriptionPeriod);

    if (isMember) {
      const member = await MemberShip.findOneAndUpdate(
        { email: user?.email },
        {
          joinDate: new Date(),
          subscription: {
            subscriptionId,
            endDate,
            price,
            subscriptionPeriod,
          },
          Active: true,
          paymentId: paymentId,
        }
      );
      const emailData = {
        email: user?.email,
        subject: "🌟 Membership Plan Upgraded 🎉",
        html: `
    <div style="background-color: #f9f9f9; padding: 40px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
      <h2 style="color: #2a7ae2; text-align: center;">Dear ${user?.name},</h2>
      <p style="color: #333; font-size: 16px; text-align: center;">Your membership plan has been successfully upgraded. 🎉</p>
      <div style="background-color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0; margin: 20px 0;">
        <h3 style="color: #2a7ae2; text-align: center;">New Membership Details</h3>
        <p style="color: #333; font-size: 16px; text-align: center;">Your new plan is <strong style="color: #2a7ae2;">₹${price} / ${subscriptionPeriod}</strong> valid up to <strong style="color: #2a7ae2;">${endDate}</strong>.</p>
      </div>
      <p style="color: #333; font-size: 16px; text-align: center;">Thank you for upgrading your plan. We hope you continue to enjoy the enhanced benefits as a Pro member. 🌟</p>
      <p style="color: #333; font-size: 14px; text-align: center; margin-top: 20px;">Best regards,<br>The ELearner Team 🎓</p>
    </div>
  `,
      };
      await sendEmail(emailData);
      return res.status(201).json({
        success: true,
        message: "Membership plan upgraded",
        member,
      });
    } else {
      const member = await MemberShip.create({
        email: user?.email,
        joinDate: Date.now(),
        subscription: {
          subscriptionId,
          price,
          subscriptionPeriod,
          endDate,
        },
        Active: true,
        paymentId: paymentId,
      });
      const emailData = {
        email: user?.email,
        subject: "🎉 Membership Plan Purchased 🌟 ",
        html: `
          <div style="background-color: #f9f9f9; padding: 40px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
            <h2 style="color: #2a7ae2; text-align: center;">🎉 Congratulations, ${user?.name}! 🌟</h2>
            <p style="color: #333; font-size: 16px; text-align: center;">You have successfully become an ELearner Pro member.</p>
            <div style="background-color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0; margin: 20px 0;">
              <h3 style="color: #2a7ae2; text-align: center;">Membership Details</h3>
              <p style="color: #333; font-size: 16px; text-align: center;">Your new plan is <strong style="color: #2a7ae2;">₹${price} / ${subscriptionPeriod}</strong> valid up to <strong style="color: #2a7ae2;">${endDate}</strong>.</p>
            </div>
            <p style="color: #333; font-size: 16px; text-align: center;">Thank you for purchasing our plan. We hope you enjoy the exclusive benefits as a Pro member. 🎓</p>
            <p style="color: #333; font-size: 14px; text-align: center; margin-top: 20px;">If you have any questions or need support, please contact our support team. 📧</p>
            <p style="color: #333; font-size: 14px; text-align: center; margin-top: 20px;">Best regards,<br>The ELearner Team 🌟</p>
          </div>
        `,
      };
      await sendEmail(emailData);
      return res.status(201).json({
        success: true,
        message: "Membership created",
        member,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getMembershipDetails = async (req, res, next) => {
  try {
    const user = req.user;
    const member = await MemberShip.findOne({
      email: user?.email,
    });
    if (!member) {
      throw Error("You have no membership");
    }

    return res.status(201).json({
      success: true,
      member,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersWithMember = async (req, res, next) => {
  try {
    const usersWithMembers = [];
    const users = await User.find({});
    for (let i = 0; i < users.length; i++) {
      const isMember = await MemberShip.findOne({
        email: users[i].email,
      });
      usersWithMembers.push({
        name: users[i].name,
        _id: users[i]._id,
        email: users[i].email,
        role: users[i].role,
        membership: isMember ? true : false,
        activeMember: isMember ? (isMember.Active ? true : false) : false,
      });
    }
    return res.status(201).json({
      success: true,
      message: "All users returns",
      usersWithMembers,
    });
  } catch (error) {
    next(error);
  }
};

export const userDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw Error("User not found");
    }
    const member = await MemberShip.findOne({
      email: user.email,
    });
    const userData = {
      user,
      member,
    };
    return res.status(200).json({
      success: true,
      userData,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelMembership = async (req, res, next) => {
  try {
    const user = req.user;
    const member = await MemberShip.findOne({
      email: user?.email,
    });
    if (!member) {
      throw Error("You have no membership");
    }
    const emailData = {
      email: user?.email,
      subject: "Canceletion of Membership ",
      html: `
        <h3>Dear ${user?.name} your Membership plan is Cancled today.</h3>
        <p>If you have any query regarding our pro membership plan free feal to reachout us.</p>
      `,
    };
    await sendEmail(emailData);

    await member.deleteOne();

    return res.status(201).json({
      success: true,
      message: "Membership canceled",
    });
  } catch (error) {
    next(error);
  }
};
