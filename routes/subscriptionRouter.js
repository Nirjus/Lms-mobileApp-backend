import { Router } from "express";

import {
  createSubscription,
  getAllSubscription,
  removeBenifits,
  removeSubscription,
  updateSubscription,
} from "../controllers/subscriptionController.js";
import { isLogin } from "../middleware/isLogin.js";

export const subscriptionRouter = Router();

// =========================== Admin Route ============================
subscriptionRouter.post("/create", isLogin, createSubscription);

subscriptionRouter.put("/update/:id", isLogin, updateSubscription);

subscriptionRouter.delete("/remove/:id", isLogin, removeSubscription);

subscriptionRouter.put("/remove-benifit/:id", isLogin, removeBenifits);

// ============================ Common Route ======================
subscriptionRouter.get("/getAll-subscription", getAllSubscription);
