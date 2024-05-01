import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  getUser,
  getUsersByPoint,
  logout,
  updatePassword,
  userLogin,
  userRegister,
  userUpdate,
} from "../controllers/userController.js";
import { isLogin } from "../middleware/isLogin.js";
import { singleUpload } from "../middleware/multer.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

const userRouter = Router();

userRouter.post("/register", limiter, userRegister);
userRouter.post("/login", limiter, userLogin);
userRouter.get("/logout", logout);

userRouter.get("/me", isLogin, getUser);
userRouter.put("/update", isLogin, singleUpload, userUpdate);
userRouter.put("/update-password", isLogin, updatePassword);

userRouter.get("/getUsers/bypoint", isLogin, getUsersByPoint);

export default userRouter;
