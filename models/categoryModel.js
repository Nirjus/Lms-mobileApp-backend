import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    icon: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Category = mongoose.model("Categories", categorySchema);

export default Category;
