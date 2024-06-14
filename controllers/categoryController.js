import cloudinary from "cloudinary";
import { getDataUri } from "../utils/fileHandler.js";
import Category from "../models/categoryModel.js";
import Course from "../models/courseModel.js";

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw Error("Category name is required");
    }

    const isExistsCategory = await Category.exists({ name: name });
    if (isExistsCategory) {
      throw Error(`${name} category is already exists`);
    }

    const category = await Category.create({
      name: name,
    });

    return res.status(201).json({
      success: true,
      message: `${name} category created successfully`,
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      throw Error("Category not found");
    }
    return res.status(201).json({
      success: true,
      category,
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
export const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find({
      isPublished: true,
    });

    return res.status(201).json({
      success: true,
      categoryLength: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllCategoryForAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });

    return res.status(201).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const publishCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      throw Error("Category not found");
    }
    const { isPublished } = req.body;
    if (!category.name || !category.icon) {
      throw Error("Missing required fields");
    }

    category.isPublished = isPublished;

    await category.save();

    return res.status(201).json({
      success: true,
      message: category?.isPublished
        ? "Category published"
        : "Category unpublished",
      category,
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

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      throw Error("Category not found!");
    }
    if (category.isPublished) {
      throw Error("Please unpublished this category before deleting");
    }
    if (category.icon.public_id) {
      await cloudinary.v2.uploader.destroy(category.icon.public_id);
    }
    const products = await Course.find({ category: category.name });
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      product.category = undefined;

      await product.save();
    }
    await category.deleteOne();

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
    const categoryName = category.name;
    if (name) {
      category.name = name;
      const products = await Course.find({ category: categoryName });
      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        product.category = name;

        await product.save();
      }
    }
    if (req.file) {
      if (category.icon.public_id) {
        await cloudinary.v2.uploader.destroy(category.icon.public_id);
      }
      const file = getDataUri(req.file);
      const myCloude = await cloudinary.v2.uploader.upload(file.content, {
        folder: "LMS-React-native",
      });

      category.icon = {
        public_id: myCloude.public_id,
        url: myCloude.secure_url,
      };
    }
    await category.save();

    return res.status(200).json({
      success: true,
      message: `${category.name} category updated`,
      category,
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
