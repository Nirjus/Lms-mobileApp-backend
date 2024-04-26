import MemberShip from "../models/memberShipmOdel.js";

export const checkMember = async (req, res, next) => {
  try {
    const user = req.user;
    const isMember = await MemberShip.findOne({
      email: user?.email,
    });

    if (!isMember) {
      return res.status(201).json({
        success: true,
        isMember,
      });
    }
    return res.status(201).json({
      success: true,
      isMember,
    });
  } catch (error) {
    next(error);
  }
};

export const createMemberShip = async (req, res, next) => {
  try {
    const { paymentId, subscription } = req.body;

    const user = req.user;
    const isMember = await MemberShip.exists({
      email: user?.email,
    });

    if (isMember) {
      throw Error("You already an member");
    }
    const member = await MemberShip.create({
      email: user?.email,
      joinDate: Date.now(),
      Active: true,
      subscription: subscription,
      paymentId: paymentId,
    });

    return res.status(201).json({
      success: true,
      message: "Membership created",
      member,
    });
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
