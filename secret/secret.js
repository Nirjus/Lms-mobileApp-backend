import dotenv from "dotenv";

dotenv.config({
  path: "./secret/.env",
});

export const port = process.env.PORT || 8001;

export const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/ELearner";

export const jwtSecret = process.env.JWT_SECRET;

export const cloudinaryName = process.env.CLOUDINARY_NAME || "";

export const cludinaryApiKey = process.env.CLOUDINARY_API_KEY || "";

export const cludinaryApiSecret = process.env.CLOUDINARY_API_SECRET || "";

export const defaultAvatar = "./assets/images/pngegg.png";

export const smtpUserName = process.env.SMTP_USERNAME || "";

export const smtpPassword = process.env.SMTP_PASSWORD || "";

export const backendUrl = process.env.BACKEND_URL || "";
