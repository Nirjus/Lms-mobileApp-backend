import cloudinary from "cloudinary";
import NodeCache from "node-cache";
import { getDataUri } from "../utils/fileHandler.js";
import Category from "../models/categoryModel.js";
import Course from "../models/courseModel.js";

const nodeCache = new NodeCache();

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw Error("Category name is required");
    }
    if (!req.file) {
      throw Error("Please Provide Category Icon");
    }
    const file = getDataUri(req.file);
    const isExistsCategory = await Category.exists({ name: name });
    if (isExistsCategory) {
      throw Error(`${name} category is already exists`);
    }
    const myClode = await cloudinary.v2.uploader.upload(file.content, {
      folder: "LMS-React-native",
    });
    const icon = {
      public_id: myClode.public_id,
      url: myClode.secure_url,
    };
    const category = await Category.create({
      name: name,
      icon: icon,
    });
    nodeCache.del("categories");
    return res.status(201).json({
      success: true,
      message: `${name} category created successfully`,
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    let categories;
    if (nodeCache.has("categories")) {
      categories = JSON.parse(nodeCache.get("categories"));
    } else {
      categories = await Category.find({});
      nodeCache.set("categories", JSON.stringify(categories));
    }

    return res.status(201).json({
      success: true,
      categoryLength: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      throw Error("Category not found!");
    }

    const products = await Course.find({ category: category.name });

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      product.category = undefined;

      await product.save();
    }

    await cloudinary.v2.uploader.destroy(category.icon.public_id);
    await category.deleteOne();
    nodeCache.del("categories");
    return res.status(200).json({
      success: true,
      message: `${category.name} category deleted successfully`,
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

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findById(id);

    if (!category) {
      throw Error("Category not found!");
    }
    const cateogoryName = category.name;
    const products = await Course.find({ category: category.name });

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      product.category = name;

      await product.save();

      nodeCache.del("topCourse");
      nodeCache.del("freeCourse");
    }
    if (req.file) {
      await cloudinary.v2.uploader.destroy(category.icon.public_id);
      const file = getDataUri(req.file);
      const myCloude = await cloudinary.v2.uploader.upload(file.content, {
        folder: "LMS-React-native",
      });

      category.icon = {
        public_id: myCloude.public_id,
        url: myCloude.secure_url,
      };
    }
    category.name = name;
    await category.save();
    nodeCache.del("categories");
    return res.status(200).json({
      success: true,
      message: `${cateogoryName} category updated to ${category.name}`,
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
