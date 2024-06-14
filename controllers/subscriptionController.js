import Subscription from "../models/subscriptionModel.js";

const memberShipName = (date) => {
  const [digit, dateType] = date.split(" ");
  if (dateType === "week") {
    return "Weekly plan / Basic";
  } else if (dateType === "day") return "Daily plan / essential";
  else if (dateType === "month") return "Monthly plan / grow";
  else if (dateType === "year") return "Annual plan / premium";
  else {
    return "Best plan ";
  }
};
export const createSubscription = async (req, res, next) => {
  try {
    const { price, validity, benifit } = req.body;
    if (!price || !validity || !benifit) {
      throw Error("Add all fields first");
    }
    const subscription = await Subscription.create({
      price: price,
      validity: validity,
    });
    const modelName = memberShipName(validity);
    subscription.modelName = modelName;
    if (benifit) {
      subscription.benifits.push(benifit);
    }
    await subscription.save();
    return res.status(201).json({
      success: true,
      message: "Subscription model created",
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw Error("Subscription not found!");
    }
    const { price, validity, benifit } = req.body;
    if (price) {
      subscription.price = price;
    }
    if (validity) {
      subscription.validity = validity;
      const modelName = memberShipName(validity);
      subscription.modelName = modelName;
    }
    if (benifit) {
      subscription.benifits.push(benifit);
    }
    await subscription.save();
    return res.status(201).json({
      success: true,
      message: "Subscription model updated",
      subscription,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    next(error);
  }
};

export const removeSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      throw Error("Subscription not found");
    }

    await subscription.deleteOne();

    return res.status(201).json({
      success: true,
      message: "Subscription removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const removeBenifits = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      throw Error("Subscription not found");
    }

    const { index } = req.body;
    subscription.benifits.splice(index, 1);

    await subscription.save();

    return res.status(201).json({
      success: true,
      message: "Benifit remove",
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.find({}).sort({ createdAt: -1 });

    return res.status(201).json({
      success: true,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};
