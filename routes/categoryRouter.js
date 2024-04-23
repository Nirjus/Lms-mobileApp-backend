import { Router } from "express";

import { singleUpload } from "../middleware/multer.js";
import { isLogin } from "../middleware/isLogin.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const categoryRoutes = Router();

categoryRoutes.get("/getAll-category", getAllCategory);

// =================== Admin route =========================
categoryRoutes.post("/create", isLogin, isAdmin, singleUpload, createCategory);

categoryRoutes.put(
  "/update/:id",
  isLogin,
  isAdmin,
  singleUpload,
  updateCategory
);

categoryRoutes.delete("/delete/:id", isLogin, isAdmin, deleteCategory);

export default categoryRoutes;
