import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    joinDate: {
      type: Date,
      required: true,
    },
    subscription: {
      subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
      },
      endDate: {
        type: Date,
        required: true,
      },
      subscriptionPeriod: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    Active: {
      type: Boolean,
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MemberShip = mongoose.model("MemberShips", memberSchema);

export default MemberShip;
