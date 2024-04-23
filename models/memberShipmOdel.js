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
      type: Object,
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
