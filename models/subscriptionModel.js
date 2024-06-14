import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    modelName: {
      type: String,
    },
    price: {
      type: Number,
    },
    validity: {
      type: String,
    },
    benifits: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
